# MMM-DrawingBoard
A Drawing Board for touch displays on the Magic Mirror. 

It runs via an icon that opens up the Drawing Board in full screen. 

Clone the repo to install 
git clone https://github.com/TheSwedishMaker/MMM-DrawingBoard

add the following to your config.js 

```bash
 {
    module: "MMM-DrawingBoard",
    position: "bottom_right",
    config: {
        // Your config options (if any)
    }
},
```

This module uses MMM-ModuleController to hide all other modules when run. 
Find it here: https://github.com/TheSwedishMaker/MMM-ModuleController
