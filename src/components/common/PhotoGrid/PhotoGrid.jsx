import { useRef } from "react";
import styles from "./PhotoGrid.module.css";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

export default function PhotoGrid({ photos = [], onChange, maxPreview = 5 }) {
  const fileInputRef = useRef(null);
  const { processFiles, uploading } = usePhotoUpload();

  async function handleFileChange(e) {
    const newPhotos = await processFiles(e.target.files);
    onChange([...photos, ...newPhotos]);
    e.target.value = ""; // reset so same file can be added again
  }

  function removePhoto(id) {
    onChange(photos.filter(p => p.id !== id));
  }

  function updateCaption(id, caption) {
    onChange(photos.map(p => p.id === id ? { ...p, caption } : p));
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {photos.map(photo => (
          <div key={photo.id} className={styles.thumb}>
            <img src={photo.dataUrl} alt={photo.caption || "Trip photo"} />
            <div className={styles.thumbOverlay}>
              <button
                className={styles.removeBtn}
                onClick={() => removePhoto(photo.id)}
                title="Remove photo"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          className={styles.addBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Add photos"
        >
          {uploading ? "..." : "+"}
        </button>
      </div>

      {photos.length > maxPreview && (
        <p className={styles.count}>
          {photos.length} photos total
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}