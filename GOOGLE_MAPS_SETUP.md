# Google Maps API Setup Guide

## Overview
The View Reports page now includes professional Google Maps integration showing the exact locations where missing persons were last seen. This provides crucial visual information for search and rescue operations.

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps Static API** (for static map images)
   - **Maps JavaScript API** (optional, for interactive maps)
   - **Geocoding API** (for address validation)

4. Go to "Credentials" and create a new API key
5. Restrict the API key (recommended):
   - Set Application restrictions to "HTTP referrers"
   - Add your domain: `localhost:3000`, `localhost:3001`, and your production domain
   - Set API restrictions to only the APIs you enabled

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Google Maps API key to `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Restart your development server:
   ```bash
   npm run dev:both
   ```

### 3. Features Enabled

With Google Maps API configured, you get:

#### **Static Maps Integration**
- **Last Seen Location Maps**: High-quality satellite/road view of exact locations
- **Red Pin Markers**: Clear indication of where the person was last seen
- **Multiple Zoom Levels**: Automatic optimization for urban vs rural areas
- **Fallback Support**: Graceful degradation if API key is missing

#### **Professional Display**
- **800x400 High Resolution**: Crystal clear map images
- **Responsive Design**: Maps scale properly on all devices
- **Error Handling**: Fallback to placeholder if location can't be mapped
- **Click to Expand**: Users can click maps to open in new tab

#### **Location Features**
- **Address Geocoding**: Converts addresses to precise coordinates
- **Multiple Location Types**: Handles cities, landmarks, addresses
- **International Support**: Works worldwide
- **Real-time Updates**: Maps generate fresh for each report

## Map Display Examples

### In Report Cards
- **Thumbnail Preview**: Small map preview in report list
- **Quick Location Reference**: Instant visual location context
- **Status Indicators**: Color-coded pins for different case statuses

### In Detailed Report View
- **Large Format Maps**: Full-size 800x400 maps
- **Location Details**: Overlay showing "Last Seen Here"
- **Street Level Detail**: Zoom level optimized for search operations
- **Print Friendly**: High resolution for physical distribution

## Heatmap Integration

The system also includes AI-powered heatmap analysis:

### **Probability Zones**
- **High/Medium/Low Areas**: Color-coded likelihood zones
- **Pattern Recognition**: Based on similar missing person cases
- **Time-based Analysis**: Factors in how long person has been missing
- **Geographic Modeling**: Considers terrain, transportation, population density

### **Visual Features**
- **Heat Gradient**: Red (high probability) to blue (low probability)
- **Overlay Capability**: Can combine with Google Maps
- **Search Optimization**: Helps direct search efforts efficiently
- **Resource Allocation**: Optimize volunteer and professional search teams

## Privacy & Security

### **Data Protection**
- **No Personal Location Tracking**: Only shows last known locations
- **API Key Security**: Environment variables keep keys secure
- **Request Limiting**: Google Maps API calls are optimized
- **HTTPS Only**: All map requests use secure connections

### **Access Control**
- **Authentication Required**: Only logged-in users can view detailed reports
- **Role-based Access**: Different access levels for different users
- **Audit Trail**: All map views are logged for security

## Cost Management

### **API Usage Optimization**
- **Static Maps Only**: More cost-effective than interactive maps
- **Caching Strategy**: Maps are cached client-side
- **Request Batching**: Efficient API usage patterns
- **Fallback Images**: Reduces API calls when possible

### **Budget Control**
- **Daily Limits**: Set daily API quotas in Google Cloud Console
- **Usage Monitoring**: Track API usage in real-time
- **Alert Setup**: Get notified when approaching limits
- **Graceful Degradation**: App works even without maps

## Troubleshooting

### Common Issues

1. **Maps Not Loading**
   - Check API key is correct in `.env` file
   - Verify APIs are enabled in Google Cloud Console
   - Check browser console for error messages

2. **"Map of Location" Placeholder**
   - API key not configured or invalid
   - Location address couldn't be geocoded
   - API quota exceeded

3. **Blurry or Low Quality Maps**
   - Check internet connection
   - Verify API key has proper permissions
   - Check if static maps API is enabled

### Debug Mode

Add to your `.env` for debugging:
```env
VITE_DEBUG_MAPS=true
```

This will log map API requests to console.

## Production Deployment

### Domain Configuration
1. Update API key restrictions in Google Cloud Console
2. Add production domain to allowed referrers
3. Set up proper HTTPS certificates
4. Configure CDN for map image caching

### Performance Optimization
- Enable browser caching for map images
- Use WebP format where supported
- Implement lazy loading for maps
- Set up image optimization pipeline

## Support

For issues with Google Maps integration:
1. Check Google Cloud Console quotas and billing
2. Verify API key permissions and restrictions
3. Review error logs in browser console
4. Test with different locations to isolate issues

The maps feature greatly enhances the missing person reporting system by providing crucial visual context that can significantly improve search and rescue operations.
