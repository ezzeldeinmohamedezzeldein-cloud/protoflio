// The ngrok base URLs - update these when your ngrok URLs change
const BACKEND_NGROK = { API: "https://6975-156-201-134-125.ngrok-free.app" };
const AI_API = { URL: "https://3503-156-201-134-125.ngrok-free.app" };

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BACKEND_NGROK, AI_API };
}
