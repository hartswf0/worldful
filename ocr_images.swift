import Foundation
import Vision
import AppKit

let fileManager = FileManager.default
let currentPath = fileManager.currentDirectoryPath + "/book images"
let files = try fileManager.contentsOfDirectory(atPath: currentPath).filter { $0.hasSuffix(".png") }.sorted()

for file in files {
    let filePath = currentPath + "/" + file
    guard let image = NSImage(contentsOfFile: filePath),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        continue
    }
    
    let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    let request = VNRecognizeTextRequest { (request, error) in
        guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
        var fullText: [String] = []
        for observation in observations {
            if let topCandidate = observation.topCandidates(1).first {
                fullText.append(topCandidate.string)
            }
        }
        let preview = fullText.prefix(6).joined(separator: " | ")
        print("\(file) ===> \(preview)")
    }
    request.recognitionLevel = .accurate
    try? requestHandler.perform([request])
}
