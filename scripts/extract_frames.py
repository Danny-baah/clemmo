import os
import sys
import cv2

def extract_frames():
    video_filename = "Building_block_model_film_creation_20261006195849.mp4"
    workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    video_path = os.path.join(workspace_dir, video_filename)

    output_dir = os.path.join(workspace_dir, "public", "hero", "frames")
    os.makedirs(output_dir, exist_ok=True)

    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}", file=sys.stderr)
        sys.exit(1)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}", file=sys.stderr)
        sys.exit(1)

    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    duration = total_video_frames / fps if fps > 0 else 8.0

    target_frame_count = 144
    print(f"Source video: {video_filename}")
    print(f"Duration: {duration:.2f}s, FPS: {fps}, Total frames in source: {total_video_frames}")
    print(f"Target extracted frames: {target_frame_count} (in {output_dir})")

    # Read all frames into memory or sequentially extract sampled frames
    # Since video is only 192 frames (~8s at 1280x720), reading all frames is fast
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    actual_read = len(frames)
    print(f"Successfully read {actual_read} raw frames from video.")
    if actual_read == 0:
        print("Error: No frames could be read from video.", file=sys.stderr)
        sys.exit(1)

    # Sample exactly target_frame_count frames evenly across the video
    # Ensuring frame 0 is index 0 and final frame is the last frame
    indices = [
        int(round(i * (actual_read - 1) / (target_frame_count - 1)))
        for i in range(target_frame_count)
    ]

    saved_count = 0
    total_bytes = 0

    for i, frame_idx in enumerate(indices):
        frame = frames[frame_idx]
        output_filename = f"frame_{i:03d}.webp"
        output_path = os.path.join(output_dir, output_filename)

        # Encode as WebP with high quality (88) and balanced compression
        # This keeps artifacts undetectable while delivering optimal payload size
        encode_params = [
            cv2.IMWRITE_WEBP_QUALITY, 88
        ]
        success = cv2.imwrite(output_path, frame, encode_params)
        if success:
            saved_count += 1
            total_bytes += os.path.getsize(output_path)
        else:
            print(f"Warning: Failed to save {output_filename}", file=sys.stderr)

    print(f"Extraction complete! Saved {saved_count} frames.")
    print(f"Total size: {total_bytes / (1024 * 1024):.2f} MB (~{total_bytes / saved_count / 1024:.1f} KB/frame)")

if __name__ == "__main__":
    extract_frames()
