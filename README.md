# Dashboard Panel for H.O.R.N.E.T Storage Nostr Relay

This repository is home to the hornet storage panal which is a typescript / react web application designed for managing a hornet storage nostr multimedia relay which can be found here: https://github.com/HORNET-Storage/HORNETS-Nostr-Relay

### Live Demo
We have a live demo that can be found at http://hornetstorage.net for anyone that wants to see what the panel looks like.

## Key Features
- Manage your hornet-storage relay config directly from the panel
- Switch between our new dumb and smart model for accepting nostr notes
- Decide from which of the supported nostr kinds to enable
- Choose which supported transport protocols to enable such as libp2p and websockets
- Enable / disable which media extensions are accepted by the relay such as png and mp4
- View statistics about stored notes and media

## Previews
*All preview images are taken from the live demo*

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/e842844c-9010-4541-b84a-0487580107b9)

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/cd725852-be97-4851-b014-4de00aa445d1)

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/ff763518-d399-408b-b0b4-487292ef57d6)


## Developer Information
- 🐜 This panel relies heavily on the [Ant Design](https://ant.design/) component library with some modifications

Development mode
```
yarn install && yarn start
```

Production mode
```
yarn install && yarn build
```

*.bat and .sh files are included for starting the panel ind dev mode and for creating a production build if needed*

#### Requirements
- [Node.js](https://nodejs.org/en/) version _>=16.0.0_
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)

### Credit
This panel was created using the lightence template which can be found [here](https://github.com/altence/lightence-ant-design-react-template)
