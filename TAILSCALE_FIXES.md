# Tailscale Compatibility Fixes

## Changes Made

### 1. Enhanced NSFW Model Initialization ([nsfwChecker.js](app/service/nsfwChecker.js))

- **Multiple Backend Support**: Now tries WebGL first, then falls back to CPU backend
- **Retry Logic**: Implements 3 retry attempts with exponential backoff for model loading
- **Better Error Handling**: More detailed logging and error messages
- **Timeout Protection**: Added 30-second timeout for image classification

### 2. Dynamic Backend Configuration ([getUserInfo.js](app/_components/getUserInfo.js))

- **Environment Variable Support**: Uses `NEXT_PUBLIC_BACKEND_URL` for flexible backend configuration
- **Improved Logging**: Better console output for debugging NSFW model issues

### 3. Enhanced Next.js Configuration ([next.config.mjs](next.config.mjs))

- **CORS Headers**: Added proper CORS headers for cross-origin requests
- **Webpack Configuration**: Better TensorFlow.js compatibility with fallbacks

### 4. Environment Configuration ([.env.example](.env.example))

- **Template Configuration**: Example environment variables for different deployment scenarios

### 5. Debug Utilities ([debugUtils.js](app/service/debugUtils.js))

- **Environment Testing**: Function to debug WebGL, TensorFlow.js, and network connectivity issues

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# For development
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# For Tailscale deployment
NEXT_PUBLIC_BACKEND_URL=http://your-tailscale-ip:3001
```

### 2. Test the Configuration

Add this to your component to debug issues:

```javascript
import { debugNSFWEnvironment } from "../service/debugUtils";

useEffect(() => {
  debugNSFWEnvironment();
}, []);
```

### 3. Restart Development Server

```bash
npm run dev
```

## Common Tailscale Issues & Solutions

### Issue 1: WebGL Not Available

**Symptoms**: Model fails to load, console shows WebGL errors
**Solution**: The updated code now falls back to CPU backend automatically

### Issue 2: Cross-Origin Resource Sharing (CORS)

**Symptoms**: Network errors when loading resources
**Solution**: New CORS headers in next.config.mjs should resolve this

### Issue 3: Model Loading Timeout

**Symptoms**: Long delays or timeouts when initializing NSFW model
**Solution**: Retry logic and timeout protection now implemented

### Issue 4: Backend Connection Issues

**Symptoms**: Upload fails with network errors
**Solution**: Use environment variables to configure the correct backend URL

## Testing Steps

1. **Check Browser Console**: Look for detailed logs about model initialization
2. **Test on Different Devices**: Verify WebGL support across devices on your Tailscale network
3. **Network Connectivity**: Ensure CDN resources (TensorFlow.js, NSFWjs) are accessible
4. **Backend Connectivity**: Verify your backend server is accessible via Tailscale IP

## Troubleshooting Commands

```bash
# Test network connectivity to your backend
curl http://your-tailscale-ip:3001/health

# Check if your Next.js app is properly configured
npm run build
npm run start

# Enable verbose logging
# Add this to your browser console:
# localStorage.debug = '*'
```

## Additional Recommendations

1. **Consider Local Model**: For better performance on Tailscale, consider hosting the NSFW model locally
2. **Monitor Performance**: Check if CPU backend performs adequately for your use case
3. **Network Optimization**: Ensure good bandwidth between Tailscale nodes
4. **Browser Compatibility**: Test on different browsers as WebGL support varies

## If Issues Persist

1. Check browser developer tools for specific error messages
2. Verify Tailscale connectivity between devices
3. Test with different browsers and devices on your Tailscale network
4. Consider using the debug utility function to gather environment information
