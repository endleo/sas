# Use the official Playwright image that includes all browser dependencies
FROM mcr.microsoft.com/playwright:v1.60.0-jammy

# Create and set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy the automation script
COPY script.js ./

# Tell Playwright to skip installing other browsers we don't need (saves space)
ENV PLAYWRIGHT_BROWSER_PATH=/ms-playwright

# Run the script when the container starts
CMD ["node", "script.js"]