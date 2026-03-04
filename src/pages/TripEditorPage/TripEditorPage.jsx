// src/pages/TripEditorPage/TripEditorPage.jsx — updated to use TripEditor component
import { useState } from "react";
import styles from "./TripEditorPage.module.css";
import { useTrips } from "@/hooks/useTrips";
import { generateId } from "@/utils/imageHelpers";
import TripEditor from "@/components/trips/TripEditor";  // <-- now imported
import Button from "@/components/common/Button";

export default function TripEditorPage({ trip, onBack, onViewMap }) {
  const { addTrip, updateTrip } = useTrips();
  const isNew = !trip?.id;

  const [form, setForm] = useState(() => trip || {
    id:          null,
    name:        "",
    date:        new Date().toISOString().slice(0, 10),
    description: "",
    photos:      [],
    origin:      null,
    destination: null,
    stops:       [],
  });

  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Trip name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    isNew ? addTrip({ ...form, id: generateId() }) : updateTrip(form);
    onBack();
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <div className={styles.topActions}>
            <Button variant="secondary" onClick={() => onViewMap(form)}>
              Preview Map
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isNew ? "Save Trip" : "Update Trip"}
            </Button>
          </div>
        </div>

        {/* The form itself is now fully delegated to TripEditor */}
        <TripEditor
          form={form}
          errors={errors}
          onChange={setForm}
        />

        {/* Bottom save button */}
        <div className={styles.bottomActions}>
          <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
            {isNew ? "Save Trip" : "Update Trip"}
          </Button>
        </div>

      </div>
    </div>
  );
}