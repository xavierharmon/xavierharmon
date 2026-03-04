import { useRef, useEffect } from "react";
import styles from "./PlaceInput.module.css";

export default function PlaceInput({ label, value, onSelect, placeholder }) {
  const inputRef = useRef(null);
  const acRef    = useRef(null);

  useEffect(() => {
    if (!window.google || acRef.current) return;

    acRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode", "establishment"],
    });

    acRef.current.addListener("place_changed", () => {
      const place = acRef.current.getPlace();
      if (place?.geometry) {
        onSelect({
          name: place.formatted_address || place.name,
          lat:  place.geometry.location.lat(),
          lng:  place.geometry.location.lng(),
        });
      }
    });
  });

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={inputRef}
        defaultValue={value?.name || ""}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}