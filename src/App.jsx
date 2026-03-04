import { useState } from "react";
import { VIEWS } from "@/constants";
import TripListPage from "@/pages/TripListPage";
import TripEditorPage from "@/pages/TripEditorPage";
import MapPage from "@/pages/MapPage";

export default function App() {
  const [view, setView] = useState(VIEWS.LIST);
  const [selectedTrip, setSelectedTrip] = useState(null);

  function openEditor(trip = null) {
    setSelectedTrip(trip);
    setView(VIEWS.EDIT);
  }

  function openMap(trip) {
    setSelectedTrip(trip);
    setView(VIEWS.MAP);
  }

  function goToList() {
    setSelectedTrip(null);
    setView(VIEWS.LIST);
  }

  if (view === VIEWS.EDIT) {
    return (
      <TripEditorPage
        trip={selectedTrip}
        onBack={goToList}
        onViewMap={openMap}
      />
    );
  }

  if (view === VIEWS.MAP) {
    return (
      <MapPage
        trip={selectedTrip}
        onBack={goToList}
        onEdit={() => openEditor(selectedTrip)}
      />
    );
  }

  return (
    <TripListPage
      onNewTrip={() => openEditor(null)}
      onEditTrip={openEditor}
      onViewMap={openMap}
    />
  );
}