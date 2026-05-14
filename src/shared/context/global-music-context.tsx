import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { usePathname } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const backgroundSoundAsset = require("../../../assets/sound/background-2.mp3");
const GLOBAL_MUSIC_MUTED_KEY = "global-music-muted";

const GAME_PATH_ROOTS = new Set([
  "new-game",
  "game-turn",
  "turn-review",
  "round-result",
  "game-end",
]);

const isGameplayRoutePathname = (pathname: string) => {
  const trimmed = pathname.trim().replace(/\/+$/, "");
  if (trimmed === "" || trimmed === "/") {
    return false;
  }
  const first =
    trimmed.startsWith("/") ? trimmed.slice(1).split("/")[0] : trimmed.split("/")[0];
  if (!first || first === "(tabs)" || first === "index") {
    return false;
  }
  return GAME_PATH_ROOTS.has(first);
};

type GlobalMusicContextValue = {
  isMuted: boolean;
  toggleMuted: () => void;
};

const GlobalMusicContext = createContext<GlobalMusicContextValue | null>(null);

export const GlobalMusicProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const pathname = usePathname();
  const isGameplayRoute = useMemo(
    () => isGameplayRoutePathname(pathname ?? ""),
    [pathname]
  );

  const [isMuted, setIsMuted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const backgroundPlayer = useAudioPlayer(backgroundSoundAsset);

  useEffect(() => {
    const hydrateMuted = async () => {
      const storedValue = await AsyncStorage.getItem(GLOBAL_MUSIC_MUTED_KEY);
      if (storedValue === "1") {
        setIsMuted(true);
      }
      setIsHydrated(true);
    };

    void hydrateMuted();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const persistMuted = async () => {
      await AsyncStorage.setItem(
        GLOBAL_MUSIC_MUTED_KEY,
        isMuted ? "1" : "0"
      );
    };

    void persistMuted();
  }, [isHydrated, isMuted]);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "duckOthers",
      interruptionModeAndroid: "duckOthers",
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (isMuted || isGameplayRoute) {
      backgroundPlayer.pause();
      void backgroundPlayer.seekTo(0);
      return;
    }

    backgroundPlayer.loop = true;
    void backgroundPlayer
      .seekTo(0)
      .then(() => {
        backgroundPlayer.play();
      })
      .catch(() => {
        backgroundPlayer.play();
      });
  }, [backgroundPlayer, isHydrated, isMuted, isGameplayRoute]);

  useEffect(() => {
    return () => {
      backgroundPlayer.pause();
      backgroundPlayer.loop = false;
      void backgroundPlayer.seekTo(0);
    };
  }, [backgroundPlayer]);

  const toggleMuted = useCallback(() => {
    setIsMuted((previous) => !previous);
  }, []);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMuted,
    }),
    [isMuted, toggleMuted]
  );

  return (
    <GlobalMusicContext.Provider value={value}>
      {children}
    </GlobalMusicContext.Provider>
  );
};

export const useGlobalMusic = () => {
  const context = useContext(GlobalMusicContext);
  if (!context) {
    throw new Error("useGlobalMusic must be used within GlobalMusicProvider");
  }

  return context;
};
