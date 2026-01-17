import hotel1 from "../../assets/hotel1.jpeg";
import hotel2 from "../../assets/hotel2.jpeg";
import room1 from "../../assets/room1.jpg";
import room2 from "../../assets/room2.jpeg";
import swim1 from "../../assets/swim1.jpeg";
import swim2 from "../../assets/swim2.jpeg";

const images = {
  "hotel-1": hotel1,
  "hotel-2": hotel2,
  "room-1": room1,
  "room-2": room2,
  "swim-1": swim1,
  "swim-2": swim2,
};

export function getImageById(id) {
  return Promise.resolve(images[id]);
}
