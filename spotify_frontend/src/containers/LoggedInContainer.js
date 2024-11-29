import { Icon } from "@iconify/react/dist/iconify.js";
import { Howl, Howler } from "howler";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import { useContext, useState } from "react";
import songContext from "../contexts/songContext";

const LoggedInContainer = ({ children }) => {
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  const { currentSong, setCurrentSong } = useContext(songContext);
  console.log(currentSong);

  const playSound = (songSrc) => {
    if (soundPlayed) {
      soundPlayed.stop();
    }
    let sound = new Howl({
      src: [songSrc],
      html5: true,
    });
    setSoundPlayed(sound);
    sound.play();
  };

  const pauseSound = () => {
    soundPlayed.pause();
  };

  const togglePlayPause = () => {
    if (isPaused) {
      playSound(currentSong.track);
      setIsPaused(false);
    } else {
      pauseSound();
      setIsPaused(true);
    }
  };

  return (
    <div className="h-full w-full bg-app-black">
      <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
        <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
          <div>
            <div className="logoDiv p-6">
              <img src={spotify_logo} alt="spotify logo" width={125} />
            </div>
            <div className="py-5">
              <IconText
                iconName={"material-symbols:home"}
                displayText={"Home"}
                active
              />
              <IconText
                iconName={"material-symbols:search-rounded"}
                displayText={"Serach"}
              />
              <IconText
                iconName={"icomoon-free:books"}
                displayText={"Your Library"}
              />
              <IconText
                iconName={"material-symbols-light:library-music-sharp"}
                displayText={"My Music"}
              />
            </div>
            <div className="pt-5">
              <IconText
                iconName={"ic:baseline-add-box"}
                displayText={"Create Playlist"}
              />
              <IconText iconName={"mdi:heart"} displayText={"Liked Songs"} />
            </div>
          </div>
          <div className="px-5">
            <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
              <Icon icon={"meteor-icons:globe"} />
              <div className="ml-2 text-sm font-semibold">English</div>
            </div>
          </div>
        </div>

        <div className="h-full w-4/5 bg-app-black overflow-auto">
          <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
            <div className="w-1/2 flex h-full">
              <div className="w-2/3 flex justify-around items-center">
                <TextWithHover displayText={"Premium"} />
                <TextWithHover displayText={"Support"} />
                <TextWithHover displayText={"Download"} />
                <div className="h-1/2 border-r border-white"></div>
              </div>
              <div className="w-1/3 flex justify-around h-full items-center">
                <TextWithHover displayText={"Upload Song"} />
                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer">
                  AC
                </div>
              </div>
            </div>
          </div>
          <div className="content p-8 pt-0 overflow-auto">{children}</div>
        </div>
      </div>
      {currentSong && (
        <div className="w-full h-1/10 bg-black bg-opacity-30 text-white flex items-center px-4 overflow-auto">
          <div className="w-1/4 flex items-center">
            <img
              src={currentSong.thumbnail}
              alt="currentSongThumbnail"
              className="h-14 w-14 rounded"
            />
            <div className="pl-4">
              <div className="text-sm hover:underline cursor-pointer">
                {currentSong.name}
              </div>
              <div className="text-xs text-gray-500 hover:underline cursor-pointer">
                {currentSong.artist.firstName +
                  " " +
                  currentSong.artist.lastName}
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-center h-full flex-col items-center">
            <div className="flex w-1/3 justify-between items-center">
              <Icon
                icon="ph:shuffle-fill"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
              <Icon
                icon="mdi:skip-previous-outline"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
              <Icon
                icon={
                  isPaused
                    ? "ic-baseline-play-circle"
                    : "ic-baseline-pause-circle"
                }
                fontSize={50}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={togglePlayPause}
              />
              <Icon
                icon="mdi:skip-next-outline"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
              <Icon
                icon="ri:repeat-fill"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
            </div>
            {/* <div>Progress bar</div> */}
          </div>
          <div className="w-1/4 flex justify-end">hello</div>
        </div>
      )}
    </div>
  );
};

export default LoggedInContainer;
