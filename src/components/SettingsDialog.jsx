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
import { RotateCcw, X, Settings } from "lucide-react";

const SETTINGS_TABS = [
  { id: "general-tab", label: "Général" },
  { id: "dates-tab", label: "Dates" },
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

export default function SettingsDialog({ isOpen, onClose, vacations = [] }) {
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
              className="absolute top-4 md:right-4 right-2 z-20 p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:border-white/40 transition-all duration-200 cursor-pointer"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <TabGroup className="flex flex-col md:flex-row h-full w-full">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col">
                <DialogTitle className="flex items-center gap-2 text-[22px] font-bold text-white mb-4 md:mb-6">
                  <Settings className="w-6 h-6" />
                  Paramètres
                </DialogTitle>

                <TabList className="flex flex-row md:flex-col md:flex-1 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  {SETTINGS_TABS.map((tab) => (
                    <Tab
                      key={tab.id}
                      className="md:w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-white/60 hover:text-white hover:bg-white/5 data-[selected]:bg-white/10 data-[selected]:text-white focus:outline-none flex-shrink-0"
                    >
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels className="flex-1 py-4 md:py-6 px-6 md:px-8 overflow-y-auto">
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
                            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white ${settings.zone === zone ? "bg-white text-zinc-900 shadow-md" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700/60"}`}
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
                          className={`w-full text-center p-3 rounded-xl text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white ${settings.roundingMethod === option.id ? "bg-white text-zinc-900 shadow-md" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700/60"}`}
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

                  <div className="bg-blue-900/20 border border-blue-500/30 text-blue-200 text-sm rounded-xl p-4 flex items-start gap-3 [&_p]:leading-relaxed">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 flex-shrink-0 mt-[3px]"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                    <p>
                      Les dates des vacances sont récupérées automatiquement.
                      Modifiez-les ici uniquement si elles ne correspondent pas
                      à votre situation (ex: heure de fin des cours spécifique,
                      départ anticipé, etc.).
                    </p>
                  </div>

                  <div className="space-y-3">
                    {vacations.map((vacation) => {
                      const isModified =
                        !!settings.vacationOverrides[vacation.name];
                      const startDate =
                        isModified &&
                        settings.vacationOverrides[vacation.name].start_date
                          ? new Date(
                              settings.vacationOverrides[vacation.name]
                                .start_date
                            )
                          : vacation.start;
                      const endDate =
                        isModified &&
                        settings.vacationOverrides[vacation.name].end_date
                          ? new Date(
                              settings.vacationOverrides[vacation.name].end_date
                            )
                          : vacation.end;

                      const formatDate = (date) =>
                        date
                          ? new Intl.DateTimeFormat("fr-FR", {
                              day: "numeric",
                              month: "short",
                            }).format(date)
                          : "";

                      return (
                        <Disclosure
                          key={vacation.name}
                          as="div"
                          className={`bg-zinc-900/50 rounded-xl ring-1 transition-all duration-300 ${isModified ? "ring-blue-500/50 bg-blue-900/10" : "ring-white/10"}`}
                        >
                          {({ open }) => (
                            <>
                              <DisclosureButton className="w-full flex items-center justify-between p-4 text-left text-white/90">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 overflow-hidden">
                                  <span className="font-medium truncate">
                                    {vacation.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400 whitespace-nowrap">
                                      {formatDate(startDate)} -{" "}
                                      {formatDate(endDate)}
                                    </span>
                                    {isModified && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-medium leading-none">
                                        Modifié
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                                  {isModified && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent disclosure from toggling
                                        handleResetVacation(vacation.name);
                                      }}
                                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-all duration-200"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">
                                        Réinitialiser
                                      </span>
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
                                    key={"start-" + vacation.name}
                                    label={
                                      <span className="flex items-center gap-2 mb-1">
                                        Date de début
                                        {settings.vacationOverrides[
                                          vacation.name
                                        ]?.start_date && (
                                          <span
                                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                            title="Cette date a été modifiée"
                                          />
                                        )}
                                      </span>
                                    }
                                    value={
                                      settings.vacationOverrides[vacation.name]
                                        ?.start_date ||
                                      (vacation.start
                                        ? vacation.start.toISOString()
                                        : "")
                                    }
                                    onChange={(value) =>
                                      handleDateChange(
                                        vacation.name,
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
                                    key={"end-" + vacation.name}
                                    label={
                                      <span className="flex items-center gap-2 mb-1">
                                        Date de fin
                                        {settings.vacationOverrides[
                                          vacation.name
                                        ]?.end_date && (
                                          <span
                                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                            title="Cette date a été modifiée"
                                          />
                                        )}
                                      </span>
                                    }
                                    value={
                                      settings.vacationOverrides[vacation.name]
                                        ?.end_date ||
                                      (vacation.end
                                        ? vacation.end.toISOString()
                                        : "")
                                    }
                                    onChange={(value) =>
                                      handleDateChange(
                                        vacation.name,
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
                      );
                    })}
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
