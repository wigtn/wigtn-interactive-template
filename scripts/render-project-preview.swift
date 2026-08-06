import AppKit
import AVFoundation
import CoreGraphics
import Foundation

enum PreviewStyle: String {
  case softFocus = "soft-focus"
  case fieldNote = "field-note"
}

struct PreviewRenderer {
  let style: PreviewStyle
  let source: CGImage
  let outputURL: URL
  let width = 960
  let height = 600
  let fps: Int32 = 30
  let duration = 4.8

  func render() throws {
    try? FileManager.default.removeItem(at: outputURL)

    let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
    let input = AVAssetWriterInput(
      mediaType: .video,
      outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
          AVVideoAverageBitRateKey: 4_400_000,
          AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        ],
      ]
    )
    input.expectsMediaDataInRealTime = false

    let adaptor = AVAssetWriterInputPixelBufferAdaptor(
      assetWriterInput: input,
      sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
        kCVPixelBufferCGImageCompatibilityKey as String: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey as String: true,
      ]
    )

    guard writer.canAdd(input) else { throw RenderError.writerSetup }
    writer.add(input)
    guard writer.startWriting() else { throw writer.error ?? RenderError.writerSetup }
    writer.startSession(atSourceTime: .zero)

    let frameCount = Int(duration * Double(fps))
    for frame in 0..<frameCount {
      while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
      guard let pool = adaptor.pixelBufferPool else { throw RenderError.pixelBufferPool }
      var optionalBuffer: CVPixelBuffer?
      guard CVPixelBufferPoolCreatePixelBuffer(nil, pool, &optionalBuffer) == kCVReturnSuccess,
            let buffer = optionalBuffer else { throw RenderError.pixelBufferPool }

      let progress = Double(frame) / Double(frameCount)
      draw(frame: buffer, progress: progress)
      let time = CMTime(value: CMTimeValue(frame), timescale: fps)
      guard adaptor.append(buffer, withPresentationTime: time) else {
        throw writer.error ?? RenderError.appendFrame
      }
    }

    input.markAsFinished()
    let semaphore = DispatchSemaphore(value: 0)
    writer.finishWriting { semaphore.signal() }
    semaphore.wait()
    guard writer.status == .completed else { throw writer.error ?? RenderError.finish }
  }

  private func draw(frame buffer: CVPixelBuffer, progress: Double) {
    CVPixelBufferLockBaseAddress(buffer, [])
    defer { CVPixelBufferUnlockBaseAddress(buffer, []) }
    guard let baseAddress = CVPixelBufferGetBaseAddress(buffer),
          let context = CGContext(
            data: baseAddress,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
          ) else { return }

    context.setFillColor(NSColor.black.cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    switch style {
    case .softFocus: drawSoftFocus(in: context, progress: progress)
    case .fieldNote: drawFieldNote(in: context, progress: progress)
    }
  }

  private func aspectFillRect(scale: CGFloat = 1, x: CGFloat = 0, y: CGFloat = 0) -> CGRect {
    let sourceRatio = CGFloat(source.width) / CGFloat(source.height)
    let targetRatio = CGFloat(width) / CGFloat(height)
    let baseWidth: CGFloat
    let baseHeight: CGFloat
    if sourceRatio > targetRatio {
      baseHeight = CGFloat(height)
      baseWidth = baseHeight * sourceRatio
    } else {
      baseWidth = CGFloat(width)
      baseHeight = baseWidth / sourceRatio
    }
    let w = baseWidth * scale
    let h = baseHeight * scale
    return CGRect(x: (CGFloat(width) - w) / 2 + x, y: (CGFloat(height) - h) / 2 + y, width: w, height: h)
  }

  private func drawSoftFocus(in context: CGContext, progress: Double) {
    let wave = CGFloat(sin(progress * .pi * 2))
    let breathe = CGFloat((1 - cos(progress * .pi * 2)) * 0.5)
    let baseRect = aspectFillRect(scale: 1.025 + breathe * 0.018, x: wave * 7, y: -breathe * 4)
    context.interpolationQuality = .high
    context.draw(source, in: baseRect)

    // The acrylic reflection drifts independently from the portrait.
    let reflectionX = CGFloat(width) * 0.43 + wave * 22
    context.saveGState()
    context.clip(to: CGRect(x: reflectionX, y: 0, width: CGFloat(width) * 0.16, height: CGFloat(height)))
    context.setAlpha(0.22 + breathe * 0.08)
    context.setBlendMode(.screen)
    context.translateBy(x: CGFloat(width), y: 0)
    context.scaleBy(x: -1, y: 1)
    context.draw(source, in: baseRect.offsetBy(dx: -wave * 16, dy: 0))
    context.restoreGState()

    // A warm seam travels through the cobalt field and closes seamlessly.
    let seamX = CGFloat(width) * 0.62 + wave * 15
    context.saveGState()
    context.setShadow(offset: .zero, blur: 14, color: NSColor(calibratedRed: 1, green: 0.19, blue: 0.10, alpha: 0.75).cgColor)
    context.setFillColor(NSColor(calibratedRed: 1, green: 0.18, blue: 0.10, alpha: 0.40 + breathe * 0.18).cgColor)
    context.fill(CGRect(x: seamX, y: 0, width: 2.2, height: CGFloat(height)))
    context.restoreGState()

    context.setFillColor(NSColor(calibratedRed: 0.02, green: 0.08, blue: 0.30, alpha: 0.04 + breathe * 0.05).cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  }

  private func drawFieldNote(in context: CGContext, progress: Double) {
    let wave = CGFloat(sin(progress * .pi * 2))
    let counter = CGFloat(cos(progress * .pi * 2))
    let baseRect = aspectFillRect(scale: 1.035, x: wave * 6, y: counter * 2)
    context.interpolationQuality = .high
    context.draw(source, in: baseRect)

    // Offset afterimages preserve the long-exposure idea already present in the still.
    context.saveGState()
    context.setBlendMode(.screen)
    context.setAlpha(0.13)
    context.draw(source, in: baseRect.offsetBy(dx: wave * 22, dy: 0))
    context.setAlpha(0.08)
    context.draw(source, in: baseRect.offsetBy(dx: -counter * 15, dy: wave * 3))
    context.restoreGState()

    // Three editorial gates move at different rates instead of one generic zoom.
    let thirds = CGFloat(width) / 3
    for index in 0..<3 {
      let phase = progress * .pi * 2 + Double(index) * 0.85
      let offset = CGFloat(sin(phase)) * CGFloat(7 + index * 2)
      context.saveGState()
      context.clip(to: CGRect(x: CGFloat(index) * thirds, y: 0, width: thirds, height: CGFloat(height)))
      context.setAlpha(0.20)
      context.setBlendMode(index == 1 ? .screen : .normal)
      context.draw(source, in: baseRect.offsetBy(dx: offset, dy: 0))
      context.restoreGState()
    }

    let redPulse = CGFloat((1 + sin(progress * .pi * 4)) * 0.5)
    context.setBlendMode(.screen)
    context.setFillColor(NSColor(calibratedRed: 0.55, green: 0.015, blue: 0.012, alpha: 0.025 + redPulse * 0.035).cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  }
}

enum RenderError: Error { case writerSetup, pixelBufferPool, appendFrame, finish, invalidArguments, sourceImage }

guard CommandLine.arguments.count == 4,
      let style = PreviewStyle(rawValue: CommandLine.arguments[1]) else { throw RenderError.invalidArguments }
let inputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[3])
guard let image = NSImage(contentsOf: inputURL),
      let source = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else { throw RenderError.sourceImage }

try PreviewRenderer(style: style, source: source, outputURL: outputURL).render()
print("Rendered \(style.rawValue): \(outputURL.path)")
