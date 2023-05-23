import {alarm, car, close, fish, flash, flower, power, shieldCheckmark, sunnySharp, water} from "ionicons/icons";

export const IconConverter = (icon: string) => {
    switch (icon) {
        case 'Coral':
            return flower;
        case 'Animal':
            return fish;
        case "Temperature": {
            return sunnySharp;
        }
        case "Climate": {
            return sunnySharp
        }
        case "Electrcity": {
            return flash
            break;
        }
        case "Car": {
            return car
            break;
        }
        case "Volt": {
            return power
            break;
        }
        case "Current": {
            return power
            break;
        }
        case "Check": {
            return shieldCheckmark
            break;
        }
        case "Alarm": {
            return alarm
            break;
        }
        case "OnOff": {
            return close
            break;
        }
        default: {
            return water;
            break;
        }
    }
}