
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, Upload, Eye, RotateCcw } from 'lucide-react';
import { useThemeSettings } from './hooks/useThemeSettings';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
}

const ThemeSettings = () => {
  const { themeQuery, updateThemeMutation } = useThemeSettings();
  const [previewColors, setPreviewColors] = useState<ThemeColors | null>(null);

  const { data: themeSettings, isLoading } = themeQuery;

  const currentColors = previewColors || themeSettings?.theme_colors || {};
  const defaultColors: ThemeColors = {
    primary: "#3b82f6",
    secondary: "#64748b", 
    accent: "#10b981",
    background: "#ffffff",
    foreground: "#0f172a"
  };

  const colorPresets = [
    { name: "Default Blue", colors: { primary: "#3b82f6", secondary: "#64748b", accent: "#10b981", background: "#ffffff", foreground: "#0f172a" }},
    { name: "Purple Theme", colors: { primary: "#8b5cf6", secondary: "#64748b", accent: "#f59e0b", background: "#ffffff", foreground: "#0f172a" }},
    { name: "Green Theme", colors: { primary: "#10b981", secondary: "#64748b", accent: "#3b82f6", background: "#ffffff", foreground: "#0f172a" }},
    { name: "Dark Mode", colors: { primary: "#3b82f6", secondary: "#94a3b8", accent: "#10b981", background: "#0f172a", foreground: "#ffffff" }},
  ];

  const handleColorChange = (colorKey: string, value: string) => {
    setPreviewColors({
      ...currentColors,
      [colorKey]: value
    });
  };

  const saveColors = () => {
    if (previewColors) {
      updateThemeMutation.mutate({ key: 'theme_colors', value: previewColors });
      setPreviewColors(null);
    }
  };

  const resetColors = () => {
    setPreviewColors(defaultColors);
  };

  const applyPreset = (preset: any) => {
    setPreviewColors(preset.colors);
  };

  if (isLoading) {
    return <div>Loading theme settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Color Customization */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Scheme
        </h3>
        
        {/* Color Presets */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex gap-1">
                  {Object.values(preset.colors).slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color as string }}
                    />
                  ))}
                </div>
                <span className="text-xs">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(currentColors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="text-sm font-medium capitalize">{key} Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={value as string}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={value as string}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview and Actions */}
        <div className="flex gap-3 mt-6">
          <Button onClick={saveColors} disabled={!previewColors}>
            Save Colors
          </Button>
          <Button variant="outline" onClick={resetColors}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>

      <Separator />

      {/* Logo Management */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Company Logo
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Current Logo</Label>
            <div className="border rounded-lg p-4 bg-gray-50">
              {themeSettings?.company_logo?.url ? (
                <img 
                  src={themeSettings.company_logo.url} 
                  alt={themeSettings.company_logo.alt || "Company Logo"}
                  className="max-h-16 max-w-48 object-contain"
                />
              ) : (
                <div className="text-gray-500 text-sm">No logo uploaded</div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Logo URL</Label>
            <Input
              placeholder="https://example.com/logo.png"
              defaultValue={themeSettings?.company_logo?.url || ''}
              onBlur={(e) => {
                const newLogo = {
                  ...themeSettings?.company_logo,
                  url: e.target.value
                };
                updateThemeMutation.mutate({ key: 'company_logo', value: newLogo });
              }}
            />
            <p className="text-xs text-gray-600">Enter a direct URL to your logo image</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Logo Alt Text</Label>
            <Input
              placeholder="Company Logo"
              defaultValue={themeSettings?.company_logo?.alt || ''}
              onBlur={(e) => {
                const newLogo = {
                  ...themeSettings?.company_logo,
                  alt: e.target.value
                };
                updateThemeMutation.mutate({ key: 'company_logo', value: newLogo });
              }}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Live Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Live Preview
        </h3>
        <Card style={{ 
          backgroundColor: currentColors.background,
          color: currentColors.foreground,
          borderColor: currentColors.secondary 
        }}>
          <CardHeader style={{ borderBottomColor: currentColors.secondary }}>
            <CardTitle style={{ color: currentColors.primary }}>
              Sample Dashboard Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button style={{ backgroundColor: currentColors.primary, color: currentColors.background }}>
              Primary Button
            </Button>
            <Button variant="outline" style={{ borderColor: currentColors.secondary, color: currentColors.foreground }}>
              Secondary Button
            </Button>
            <div className="p-3 rounded" style={{ backgroundColor: currentColors.accent + '20', color: currentColors.foreground }}>
              <span style={{ color: currentColors.accent }}>Accent color</span> used for highlights and important elements
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeSettings;
