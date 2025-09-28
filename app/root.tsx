import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>VNCompare</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Beautiful Modern UI Styles for VNCompare */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            * { 
              box-sizing: border-box; 
              margin: 0; 
              padding: 0; 
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6; 
              color: #1a202c;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            
            /* HomePage Container */
            ._homePage_1sh2x_2 {
              min-height: 100vh;
              background: transparent;
            }
            
            /* Hero Section */
            ._hero_1sh2x_8 {
              position: relative;
              padding: 8rem 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              overflow: hidden;
            }
            
            ._hero_1sh2x_8::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="grain"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.1;
              pointer-events: none;
            }
            
            ._heroContent_1sh2x_15 {
              position: relative;
              z-index: 2;
              text-align: center;
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 2rem;
            }
            
            ._heroTitle_1sh2x_24 {
              font-size: 4.5rem;
              font-weight: 800;
              margin-bottom: 1.5rem;
              background: linear-gradient(135deg, #ffffff, #f0f8ff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              letter-spacing: -0.02em;
            }
            
            @media (max-width: 768px) {
              ._heroTitle_1sh2x_24 {
                font-size: 2.5rem;
              }
            }
            
            ._heroSubtitle_1sh2x_30 {
              font-size: 1.5rem;
              margin-bottom: 3rem;
              opacity: 0.95;
              font-weight: 400;
              max-width: 600px;
              margin-left: auto;
              margin-right: auto;
            }
            
            ._savingsBadge_1sh2x_35 {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 50px;
              padding: 1rem 2rem;
              font-size: 1.1rem;
              font-weight: 600;
              margin-bottom: 3rem;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
            
            ._savingsBadge_1sh2x_35:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }
            
            /* Search Card */
            ._searchCard_1sh2x_48 {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 24px;
              padding: 2.5rem;
              margin-top: 4rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
            }
            
            ._searchCard_1sh2x_48:hover {
              transform: translateY(-5px);
              box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
            }
            
            ._searchTitle_1sh2x_59 {
              font-size: 1.75rem;
              font-weight: 700;
              margin-bottom: 2rem;
              color: #2d3748;
              text-align: center;
            }
            
            /* Sections */
            ._section_1sh2x_66 {
              padding: 8rem 0;
              position: relative;
            }
            
            ._section_1sh2x_66:nth-child(even) {
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            }
            
            ._section_1sh2x_66:nth-child(odd) {
              background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
            }
            
            ._sectionTitle_1sh2x_80 {
              font-size: 3rem;
              font-weight: 800;
              margin-bottom: 3rem;
              color: #2d3748;
              text-align: center;
              letter-spacing: -0.02em;
            }
            
            /* Brand Cards Grid */
            ._brandsGrid_1sh2x_88 {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 2rem;
              margin-bottom: 4rem;
            }
            
            ._brandCard_1sh2x_95 {
              background: white;
              border-radius: 20px;
              padding: 2rem;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
              border: 1px solid rgba(0, 0, 0, 0.05);
              position: relative;
              overflow: hidden;
            }
            
            ._brandCard_1sh2x_95::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #667eea, #764ba2);
              transform: scaleX(0);
              transition: transform 0.3s ease;
            }
            
            ._brandCard_1sh2x_95:hover {
              transform: translateY(-10px);
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            }
            
            ._brandCard_1sh2x_95:hover::before {
              transform: scaleX(1);
            }
            
            ._brandName_1sh2x_112 {
              font-size: 1.25rem;
              font-weight: 600;
              margin-top: 1rem;
              color: #2d3748;
            }
            
            /* Utility Classes */
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 2rem;
            }
            
            .text-center { text-align: center; }
            .mb-12 { margin-bottom: 3rem; }
            .p-6 { padding: 1.5rem; }
            .pt-0 { padding-top: 0; }
            .mt-8 { margin-top: 2rem; }
            
            /* Buttons */
            button {
              font-family: inherit;
              cursor: pointer;
              border: none;
              outline: none;
              transition: all 0.3s ease;
              font-weight: 500;
              border-radius: 12px;
              position: relative;
              overflow: hidden;
            }
            
            button:not([class*="secondary"]) {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 1rem 2rem;
              font-size: 1rem;
              box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            }
            
            button:not([class*="secondary"]):hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
            }
            
            /* Form Elements */
            input, select {
              font-family: inherit;
              padding: 1rem;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              font-size: 1rem;
              transition: all 0.3s ease;
              background: white;
              width: 100%;
            }
            
            input:focus, select:focus {
              outline: none;
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
              color: #4a5568;
            }
            
            /* Links */
            a {
              text-decoration: none;
              color: inherit;
              transition: all 0.3s ease;
            }
            
            /* SVG Icons */
            svg {
              transition: all 0.3s ease;
            }
            
            /* Animations */
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            ._brandCard_1sh2x_95 {
              animation: fadeInUp 0.6s ease forwards;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
              ._hero_1sh2x_8 {
                padding: 4rem 0;
              }
              
              ._section_1sh2x_66 {
                padding: 4rem 0;
              }
              
              ._sectionTitle_1sh2x_80 {
                font-size: 2rem;
              }
              
              .container {
                padding: 0 1rem;
              }
              
              ._brandsGrid_1sh2x_88 {
                grid-template-columns: 1fr;
                gap: 1.5rem;
              }
            }
            
            /* Custom Scrollbar */
            ::-webkit-scrollbar {
              width: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #5a67d8, #6b46a3);
            }
          `
        }} />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}