## VIT Chennai Captcha Solver (Modified)

This is a modified version of the VtopCaptchaSolver3.0 originally created by Pratyush.

### Why?

The original version had some issues when I tried to use it on my browser. Specifically, the extension seemed to send data to a server(for further trainig the model ig), which caused errors for me.

This modified version changed following:

* **Removed Server Communication:** Removed the parts of the code that tried to send data back to a server. This stopped the errors I was seeing.
* **Corrected Weights:** The original model's weights for the Chennai campus were not working correctly(returned an UNDEFINED eevrytime I ran it). This version now uses the working weights of the Vellore campus version.
* **Tree-shake:** Removed support for other Vtop websites (like those for Vellore, AP and Bhopal). This made the code simpler and smaller, as it only focuses on the Chennai campus.

### Now

This solver is now focused only on the Chennai campus websites:

* [`vtop chennai`](http://vtopcc.vit.ac.in/)
* [`vtopreg chennai`](http://vtopregcc.vit.ac.in/)

> **Note on vtopreg:** The accuracy for vtopreg is a bit lower and might not always work perfectly.

### Installation

1.  **Clone:** Get the code by cloning this repository.
2.  **Open Extensions:** Go to your browser's extensions page (e.g., `chrome://extensions` for Chrome/Edge or `about:addons` for Firefox).
3.  **Enable Developer Mode:** Turn on **Developer mode** (usually a toggle switch in the top corner).
4.  **Load Extension:** Click on **"Load unpacked"** (or a similar button) and select the folder you cloned.

The extension is now active and ready to solve captchas on the VIT Chennai pages.

### Credits

This tool is a modification of the original work:

* **Original Author:** [pratyush](https://github.com/pratyush3124)
* **Original Repository:** [CaptchsSolver3.0](https://github.com/pratyush3124/VtopCaptchaSolver3.0)