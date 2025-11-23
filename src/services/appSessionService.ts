// Service to manage user's logged-in apps
interface LoggedInApp {
  id: string;
  name: string;
  icon: string;
  loggedInAt: string;
}

class AppSessionService {
  private storageKey = 'probus_logged_in_apps';

  // Get all logged-in apps for current user
  getLoggedInApps(): LoggedInApp[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading logged-in apps:', error);
      return [];
    }
  }

  // Add an app to logged-in apps
  addLoggedInApp(appId: string, appName: string, icon: string): void {
    const loggedInApps = this.getLoggedInApps();
    
    // Check if app is already logged in
    const existingApp = loggedInApps.find(app => app.id === appId);
    if (existingApp) {
      // Update login time
      existingApp.loggedInAt = new Date().toISOString();
    } else {
      // Add new logged-in app
      loggedInApps.push({
        id: appId,
        name: appName,
        icon,
        loggedInAt: new Date().toISOString()
      });
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(loggedInApps));
    } catch (error) {
      console.error('Error saving logged-in app:', error);
    }
  }

  // Remove an app from logged-in apps
  removeLoggedInApp(appId: string): void {
    const loggedInApps = this.getLoggedInApps();
    const updatedApps = loggedInApps.filter(app => app.id !== appId);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updatedApps));
    } catch (error) {
      console.error('Error removing logged-in app:', error);
    }
  }

  // Check if an app is logged in
  isAppLoggedIn(appId: string): boolean {
    const loggedInApps = this.getLoggedInApps();
    return loggedInApps.some(app => app.id === appId);
  }

  // Clear all logged-in apps (logout all)
  clearAllLoggedInApps(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing logged-in apps:', error);
    }
  }
}

export default new AppSessionService();