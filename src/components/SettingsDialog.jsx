import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import { DateTimePicker } from "./DateTimePicker.jsx";
import { getSchoolYear } from "@/lib/utils.js";

const SETTINGS_TABS = [
  { id: "general-tab", label: "Général" },
  { id: "dates-tab", label: "Dates" },
];

const VACATION_NAMES = [
  "Vacances de la Toussaint",
  "Vacances de Noël",
  "Vacances d'Hiver",
  "Vacances de Printemps",
  "Pont de l'Ascension",
  "Début des Vacances d'Été",
];

const ROUNDING_OPTIONS = [
  {
    id: "floor",
    label: "Arrondir à l'inférieur",
    description: "Ex: 3.7 jours → 3",
  },
  {
    id: "round",
    label: "Arrondir au plus proche",
    description: "Ex: 3.7 jours → 4",
  },
  {
    id: "ceil",
    label: "Arrondir au supérieur",
    description: "Ex: 3.2 jours → 4",
  },
];

export default function SettingsDialog({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    zone: "C",
    vacationOverrides: {},
    roundingMethod: "round",
  });

  useEffect(() => {
    if (isOpen) {
      const savedSettings = JSON.parse(
        localStorage.getItem("settings") || "{}"
      );

      setSettings((currentSettings) => ({
        ...currentSettings,
        ...savedSettings,
      }));
    }
  }, [isOpen]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const handleDateChange = (vacationName, field, value) => {
    const newOverrides = {
      ...settings.vacationOverrides,
      [vacationName]: {
        ...settings.vacationOverrides[vacationName],
        [field]: value,
      },
    };
    handleSettingChange("vacationOverrides", newOverrides);
  };

  const handleResetVacation = (vacationName) => {
    const newOverrides = { ...settings.vacationOverrides };
    delete newOverrides[vacationName];
    handleSettingChange("vacationOverrides", newOverrides);
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative w-full max-w-4xl h-[90vh] md:h-[600px] bg-zinc-900 rounded-2xl shadow-2xl border-2 border-white/10 flex overflow-hidden duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <TabGroup className="flex flex-col md:flex-row h-full w-full">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col">
                <DialogTitle className="flex items-center gap-2 text-[22px] font-bold text-white mb-4 md:mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  Paramètres
                </DialogTitle>

                <TabList className="flex flex-row md:flex-col md:flex-1 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  {SETTINGS_TABS.map((tab) => (
                    <Tab
                      key={tab.id}
                      className="md:w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-white/60 hover:text-white hover:bg-white/5 data-[selected]:bg-white/10 data-[selected]:text-white focus:outline-none flex-shrink-0"
                    >
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels className="flex-1 p-6 md:p-8 overflow-y-auto">
                <TabPanel className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Général</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-zinc-900/50 rounded-xl p-5 ring-1 ring-white/10">
                      <label className="block text-sm font-medium text-zinc-400 mb-3">
                        Zone
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["A", "B", "C"].map((zone) => (
                          <button
                            key={zone}
                            onClick={() => handleSettingChange("zone", zone)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white ${settings.zone === zone ? "bg-white text-zinc-900 shadow-md" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700/60"}`}
                          >
                            Zone {zone}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-xl p-5 ring-1 ring-white/10">
                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                      Méthode d'arrondi
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {ROUNDING_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleSettingChange("roundingMethod", option.id)
                          }
                          className={`w-full text-center p-3 rounded-lg text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white ${settings.roundingMethod === option.id ? "bg-white text-zinc-900 shadow-md" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700/60"}`}
                        >
                          <span className="block font-medium">
                            {option.label}
                          </span>
                          <span className="block text-xs text-current/70 mt-1">
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabPanel>

                <TabPanel className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      Dates des vacances
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {VACATION_NAMES.map((vacationName) => (
                      <Disclosure
                        key={vacationName}
                        as="div"
                        className="bg-zinc-900/50 rounded-xl ring-1 ring-white/10 transition-all duration-300"
                      >
                        {({ open }) => (
                          <>
                            <DisclosureButton className="w-full flex items-center justify-between p-4 text-left text-white/90">
                              <span className="font-medium">
                                {vacationName}
                              </span>
                              <div className="flex items-center gap-4">
                                {settings.vacationOverrides[vacationName] && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent disclosure from toggling
                                      handleResetVacation(vacationName);
                                    }}
                                    className="px-3 py-1 bg-zinc-800 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-all duration-200 text-xs"
                                  >
                                    Réinitialiser
                                  </button>
                                )}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className={`w-5 h-5 text-white/60 transition-transform duration-200 ${open ? "transform rotate-180" : ""}`}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                  />
                                </svg>
                              </div>
                            </DisclosureButton>

                            <DisclosurePanel
                              transition
                              className="p-6 border-t border-white/10 origin-top duration-300 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <DateTimePicker
                                  key={"start-" + vacationName}
                                  label="Date de début"
                                  value={
                                    settings.vacationOverrides[vacationName]
                                      ?.start_date || ""
                                  }
                                  onChange={(value) =>
                                    handleDateChange(
                                      vacationName,
                                      "start_date",
                                      value
                                    )
                                  }
                                  startMonth={
                                    new Date(getSchoolYear(true)[0], 0)
                                  }
                                  endMonth={
                                    new Date(getSchoolYear(true)[1], 11)
                                  }
                                />
                                <DateTimePicker
                                  key={"end-" + vacationName}
                                  label="Date de fin"
                                  value={
                                    settings.vacationOverrides[vacationName]
                                      ?.end_date || ""
                                  }
                                  onChange={(value) =>
                                    handleDateChange(
                                      vacationName,
                                      "end_date",
                                      value
                                    )
                                  }
                                  startMonth={
                                    new Date(getSchoolYear(true)[0], 0)
                                  }
                                  endMonth={
                                    new Date(getSchoolYear(true)[1], 11)
                                  }
                                />
                              </div>
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
