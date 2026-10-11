"use client";

import { useState } from "react";

export default function Home() {
  const [sessionName, setSessionName] = useState("");
  const [message, setMessage] = useState("");
  const [screen,setScreen] = useState("home");
  const [tokenValue,setTokenValue] = useState("10");
  const [players, setPlayers] = useState<
  { id: number; name: string; buyIn: string }[]
  >([]);

  const [playerName, setPlayerName] = useState("");
  const [buyInAmount, setBuyInAmount] = useState("");

  function handleCreateSession() {
    if (!sessionName.trim()) {
      setMessage("Please enter a session name.");
      return;
    }

    setScreen("setup");
  }

  function handleAddPlayer() {
    if (!playerName.trim() || !buyInAmount.trim()) {
      return;
    }

    const newPlayer = {
      id: Date.now(),
      name: playerName.trim(),
      buyIn: buyInAmount,
    };

    setPlayers([...players, newPlayer]);

    setPlayerName("");
    setBuyInAmount("");
  }

  if (screen === "setup") {
  return (
    <main className="min-h-screen bg-[#151916] text-[#F4F5F0] p-6">
      <div className="mx-auto max-w-lg">
        <p className="text-sm text-[#80A88B]">NEW SESSION</p>

        <h1 className="mt-3 text-3xl font-bold">
          {sessionName.trim()}
        </h1>

        <div className="mt-6 rounded-2xl bg-[#222923] p-6">
          <label className="block text-sm">
            Token value (₹ per token)
          </label>

          <input
            type="number"
            min="0.01"
            step="any"
            value = {tokenValue}
            onChange={(event) => setTokenValue(event.target.value)}
            className="mt-2 w-full rounded-lg bg-[#151916] p-3 text-[#F4F5F0]"
          />
        
          
        <div className="mt-5">
          <label className="block text-sm font-medium">
            Player name
          </label>
          <input
            type="text"
            placeholder="e.g. Rahul"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            className="mt-2 w-full rounded-lg bg-[#151916] p-3 text-[#F4F5F0]"
          />
        </div>



        <div className="mt-5">
          <label className="block text-sm font-medium">
            Starting buy-in (₹)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={buyInAmount}
            onChange={(event) => setBuyInAmount(event.target.value)}
            className="mt-2 w-full rounded-lg bg-[#151916] p-3 text-[#F4F5F0]"
          />
        </div>



        <button
          type="button"
          onClick={handleAddPlayer}
          className="mt-5 w-full rounded-lg bg-[#80A88B] px-4 py-3 font-semibold text-[#151916] transition hover:brightness-110"
        >
          Add Player
        </button>

        {players.length > 0 && (
          <div className="mt-4 space-y-2">
            {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-lg bg-[#151916] p-3"
            >
              <span>{player.name}</span>
              <span className="text-[#80A88B]">
                ₹{player.buyIn}
              </span>
            </div>
          ))}
        </div>
      )}


          <button
            onClick={() => setScreen("home")}
            className="mt-5 rounded-lg border border-[#80A88B] px-4 py-2"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-[#151916] text-[#F4F5F0] flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#80A88B]">
          Virtual Poker Ledger
        </p>

        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
          Your game.
          <br />
          Your ledger.
        </h1>

        <p className="mt-4 text-[#a8afa8]">
          Keep every token accounted for.
        </p>

        <div className="mt-10 rounded-2xl border border-[#343c35] bg-[#222923] p-6 text-left">
          <label
            htmlFor="sessionName"
            className="block text-sm font-medium"
          >
            Session name
          </label>

          <input
            id="sessionName"
            type="text"
            placeholder="e.g. Sunday Game"
            value={sessionName}
            onChange={(event) => setSessionName(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#414a42] bg-[#151916] px-4 py-3 text-[#F4F5F0] outline-none placeholder:text-gray-500 focus:border-[#80A88B]"
          />

          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-[#80A88B] px-4 py-3 font-semibold text-[#151916] transition hover:brightness-110"
            onClick={handleCreateSession} 
          >
            Create New Session
          </button>
          {message && (
            <p className="mt-3 text-sm text-[#80A88B]">
              {message}
            </p>
          )}
        </div>

        <p className="mt-6 text-sm text-[#8d958e]">
          Simple. Transparent. Accountable.
        </p>
      </div>
    </main>
  );
}
