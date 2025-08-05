"use client";

import { useState } from "react";
import { 
  UserIcon, 
  HeartIcon, 
  StarIcon, 
  SparklesIcon,
  FireIcon,
  SunIcon,
  MoonIcon,
  BoltIcon,
  GiftIcon,
  CakeIcon,
  BeakerIcon,
  PuzzlePieceIcon,
  MusicalNoteIcon,
  CameraIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { 
  UserIcon as UserIconSolid,
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  SparklesIcon as SparklesIconSolid,
  FireIcon as FireIconSolid,
  SunIcon as SunIconSolid,
  MoonIcon as MoonIconSolid,
  BoltIcon as BoltIconSolid,
  GiftIcon as GiftIconSolid,
  CakeIcon as CakeIconSolid,
  BeakerIcon as BeakerIconSolid,
  MusicalNoteIcon as MusicalNoteIconSolid,
  CameraIcon as CameraIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  PuzzlePieceIcon as PuzzlePieceIconSolid
} from "@heroicons/react/24/solid";

interface IconPickerProps {
  currentIcon: string;
  onIconSelect: (iconName: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const iconOptions = [
  { name: "user-circle", label: "Usuario", outline: UserIcon, solid: UserIconSolid, color: "text-blue-500" },
  { name: "heart", label: "Corazón", outline: HeartIcon, solid: HeartIconSolid, color: "text-red-500" },
  { name: "star", label: "Estrella", outline: StarIcon, solid: StarIconSolid, color: "text-yellow-500" },
  { name: "sparkles", label: "Brillos", outline: SparklesIcon, solid: SparklesIconSolid, color: "text-purple-500" },
  { name: "fire", label: "Fuego", outline: FireIcon, solid: FireIconSolid, color: "text-orange-500" },
  { name: "sun", label: "Sol", outline: SunIcon, solid: SunIconSolid, color: "text-yellow-400" },
  { name: "moon", label: "Luna", outline: MoonIcon, solid: MoonIconSolid, color: "text-indigo-500" },
  { name: "bolt", label: "Rayo", outline: BoltIcon, solid: BoltIconSolid, color: "text-blue-400" },
  { name: "gift", label: "Regalo", outline: GiftIcon, solid: GiftIconSolid, color: "text-green-500" },
  { name: "cake", label: "Pastel", outline: CakeIcon, solid: CakeIconSolid, color: "text-pink-500" },
  { name: "coffee", label: "Laboratorio", outline: BeakerIcon, solid: BeakerIconSolid, color: "text-amber-600" },
  { name: "puzzle", label: "Puzzle", outline: PuzzlePieceIcon, solid: PuzzlePieceIconSolid, color: "text-teal-500" },
  { name: "music", label: "Música", outline: MusicalNoteIcon, solid: MusicalNoteIconSolid, color: "text-violet-500" },
  { name: "camera", label: "Cámara", outline: CameraIcon, solid: CameraIconSolid, color: "text-gray-600" },
  { name: "rocket", label: "Cohete", outline: RocketLaunchIcon, solid: RocketLaunchIconSolid, color: "text-emerald-500" },
];

export default function ModernIconPicker({ currentIcon, onIconSelect, onSave, isLoading }: IconPickerProps) {
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [isOpen, setIsOpen] = useState(false);

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    onIconSelect(iconName);
  };

  const handleSave = () => {
    onSave();
    setIsOpen(false);
  };

  const getCurrentIconData = () => {
    return iconOptions.find(icon => icon.name === selectedIcon) || iconOptions[0];
  };

  const currentIconData = getCurrentIconData();
  const CurrentIcon = currentIconData.solid;

  return (
    <div className="relative">
      {/* Botón para abrir el selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
      >
        <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gray-50 ${currentIconData.color}`}>
          <CurrentIcon className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <span className="text-gray-700 font-medium hidden sm:inline">Cambiar ícono</span>
        <span className="text-gray-700 font-medium sm:hidden">Ícono</span>
        <svg 
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel de selección */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4 sm:p-6 animate-in slide-in-from-top-2 max-w-xs sm:max-w-md md:max-w-lg mx-auto">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Elige tu ícono</h3>
          
          {/* Grid de iconos responsivo */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {iconOptions.map((icon) => {
              const IconComponent = selectedIcon === icon.name ? icon.solid : icon.outline;
              const isSelected = selectedIcon === icon.name;
              
              return (
                <button
                  key={icon.name}
                  onClick={() => handleIconClick(icon.name)}
                  className={`
                    relative p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 group
                    ${isSelected 
                      ? 'border-orange-400 bg-orange-50 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  title={icon.label}
                >
                  <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto ${icon.color} ${isSelected ? 'scale-110' : 'group-hover:scale-105'} transition-transform`} />
                  
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Vista previa */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white shadow-sm ${currentIconData.color}`}>
                <CurrentIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <p className="text-sm sm:font-medium text-gray-800">Vista previa</p>
                <p className="text-xs sm:text-sm text-gray-500">{currentIconData.label}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span className="hidden sm:inline">Guardando...</span>
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay para cerrar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
