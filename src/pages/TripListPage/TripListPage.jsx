import styles from "./TripListPage.module.css";
import { useTrips } from "@/hooks/useTrips";
import TripCard from "@/components/trips/TripCard";
import Button from "@/components/common/Button";

export default function TripListPage({ onNewTrip, onEditTrip, onViewMap }) {
  const { trips, loading, error, deleteTrip } = useTrips();

  function handleDelete(id) {
    if (window.confirm("Delete this trip? This cannot be undone.")) {
      deleteTrip(id);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>🚗</div>
          <div>
            <h1 className={styles.title}>Road Trip Memories</h1>
            <p className={styles.subtitle}>
              {loading ? "Loading…" : `${trips.length} trip${trips.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
        </div>
        <Button onClick={onNewTrip} size="md">+ New Trip</Button>
      </header>

      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      <main className={styles.main}>
        {loading ? (
          <div className={styles.empty}>Loading your trips…</div>
        ) : trips.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🗺️</span>
            <p>No trips yet. Click <strong>New Trip</strong> to start mapping your adventures!</p>
          </div>
        ) : (
          <div className={styles.tripList}>
            {trips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={onViewMap}
                onEdit={onEditTrip}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}