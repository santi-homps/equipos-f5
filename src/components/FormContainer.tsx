import { useState } from 'react';
import playersData from '../data/players.json';

interface FormData {
  [key: string]: string;
}

export const FormContainer = () => {
  const [inputMode, setInputMode] = useState<'manual' | 'pool'>('manual');
  const [inputs, setInputs] = useState<FormData>(
    Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field${i + 1}`, '']))
  );
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Determine which players to use based on the current mode
    const basePlayers = inputMode === 'manual' 
      ? Object.values(inputs) 
      : [...selectedPlayers];

    // 2. RANDOMIZATION LOGIC: Shuffle the 10 players so teams are always different
    const randomized = [...basePlayers].sort(() => Math.random() - 0.5);

    // 3. Convert back to the indexed object format for team display
    const randomizedInputs = Object.fromEntries(
      randomized.map((player, i) => [`field${i + 1}`, player])
    );
    
    setSubmitted(randomizedInputs);
  };

  const handleReset = () => {
    setInputs(
      Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field${i + 1}`, '']))
    );
    setSelectedPlayers([]);
    setSubmitted(null);
  };

const isSelectionFull = selectedPlayers.length >= 10;

  const handlePlayerSelect = (player: string) => {
    if (selectedPlayers.includes(player)) {
      // Always allow removing a player
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else if (!isSelectionFull) {
      // Only allow adding if we haven't reached 10
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const availablePlayers = playersData.players.filter(
    (player) => !selectedPlayers.includes(player)
  );

  const isFormValid = inputMode === 'manual' 
    ? Object.values(inputs).every((value) => value.trim() !== '')
    : selectedPlayers.length === 10;

  const submittedValues = submitted ? Object.values(submitted) : [];
  const firstList = submittedValues.slice(0, 5);
  const secondList = submittedValues.slice(5, 10);

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Form Section - Full Width with 2 Columns of Inputs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          JUGADORES
        </h2>

        {/* Toggle Button */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setInputMode('manual');
              setSelectedPlayers([]);
            }}
            className={`px-6 py-2 rounded-md font-medium transition ${
              inputMode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Introducir Nombres
          </button>
          <button
            onClick={() => {
              setInputMode('pool');
              setInputs(
                Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field${i + 1}`, '']))
              );
            }}
            className={`px-6 py-2 rounded-md font-medium transition ${
              inputMode === 'pool'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Seleccionar de los "clasicos"
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Manual Input Mode */}
          {inputMode === 'manual' && (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {Array.from({ length: 10 }, (_, i) => {
                  const fieldName = `field${i + 1}`;
                  return (
                    <div key={fieldName}>
                      <input
                        type="text"
                        value={inputs[fieldName]}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        placeholder={`Jugador ${i + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pool Selection Mode */}
          {inputMode === 'pool' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Available Players */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Jugadores Disponibles ({availablePlayers.length})
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {availablePlayers.length > 0 ? (
                        availablePlayers.map((player) => (
                          <button
                            key={player}
                            onClick={() => handlePlayerSelect(player)}
                            className="bg-white dark:bg-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white px-3 py-2 rounded-md text-sm transition font-medium whitespace-nowrap"
                          >
                            {player}
                          </button>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 w-full">
                          Todos los jugadores han sido seleccionados
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Players */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Jugadores Seleccionados ({selectedPlayers.length}/10)
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayers.length > 0 ? (
                        selectedPlayers.map((player) => (
                          <button
                            key={player}
                            onClick={() => handlePlayerSelect(player)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition font-medium whitespace-nowrap w-fit"
                          >
                            {player}
                          </button>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 w-full">
                          Selecciona 10 jugadores
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex items-center justify-center gap-2 py-2 px-8 rounded-md font-medium transition ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Generar equipos
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-2 px-8 rounded-md font-medium bg-red-600 hover:bg-red-700 text-white cursor-pointer transition"
            >
              Resetear
            </button>
          </div>
        </form>
      </div>

      {/* Display Section - Soccer Field */}
      <div className="bg-green-600 rounded-lg shadow-lg p-8 w-full border-4 border-white relative">
        <h2 className="text-center text-2xl font-bold mb-8 text-white drop-shadow-lg">
          EQUIPOS
        </h2>

        {submitted ? (
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-green-500 to-green-600 rounded-lg p-8 border-4 border-white">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white transform -translate-x-1/2"></div>

            {/* Center Circle */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full"></div>

            {/* Center Spot */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>

            {/* Left Goal Area */}
            <div className="absolute left-[-4px] top-1/4 w-16 h-1/2 border-4 border-white rounded-r-lg"></div>

            {/* Right Goal Area */}
            <div className="absolute right-[-4px] top-1/4 w-16 h-1/2 border-4 border-white rounded-l-lg"></div>

            {/* Teams Grid */}
            <div className="grid grid-cols-2 gap-8 relative z-10">
              {/* First Team - Left Side */}
              <div className="space-y-2 flex flex-col items-center justify-center">
                <h3 className="font-bold text-white text-center mb-4 drop-shadow-lg">
                  EQUIPO 1
                </h3>
                {firstList.map((value, index) => (
                  <div
                    key={index}
                    className="bg-black whitespace-nowrap w-fit text-white rounded-lg px-3 py-2 text-sm font-semibold text-center shadow-lg transform hover:scale-105 transition"
                  >
                    {value}
                  </div>
                ))}
              </div>

              {/* Second Team - Right Side */}
              <div className="space-y-2 flex flex-col items-center justify-center">
                <h3 className="font-bold text-black text-center mb-4 drop-shadow-lg">
                  EQUIPO 2
                </h3>
                {secondList.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white whitespace-nowrap w-fit text-black rounded-lg px-3 py-2 text-sm font-semibold text-center shadow-lg transform hover:scale-105 transition"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-white drop-shadow-lg">
            <p className="text-center text-lg font-semibold">
              Llena los 10 campos para generar los equipos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
