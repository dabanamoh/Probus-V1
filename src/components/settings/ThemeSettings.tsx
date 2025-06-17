
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, Upload, Eye, RotateCcw, ImageIcon, X } from 'lucide-react';
import { useThemeSettings } from './hooks/useThemeSettings';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
}

const ThemeSettings = () => {
  const { themeQuery, updateThemeMutation, uploadLogoMutation, applyThemeColors } = useThemeSettings();
  const [previewColors, setPreviewColors] = useState<ThemeColors | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      applyThemeColors(previewColors);
      setPreviewColors(null);
    }
  };

  const resetColors = () => {
    setPreviewColors(defaultColors);
  };

  const applyPreset = (preset: any) => {
    setPreviewColors(preset.colors);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      uploadLogoMutation.mutate(file);
    }
  };

  const removeLogo = () => {
    updateThemeMutation.mutate({ 
      key: 'company_logo', 
      value: { url: '', alt: '', fileName: '' } 
    });
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
          <Button 
            onClick={saveColors} 
            disabled={!previewColors || updateThemeMutation.isPending}
          >
            {updateThemeMutation.isPending ? 'Saving...' : 'Save Colors'}
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
          <ImageIcon className="w-5 h-5" />
          Company Logo
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Current Logo</Label>
            <div className="border rounded-lg p-4 bg-gray-50 min-h-24 flex items-center justify-center">
              {themeSettings?.company_logo?.url ? (
                <div className="relative group">
                  <img 
                    src={themeSettings.company_logo.url} 
                    alt={themeSettings.company_logo.alt || "Company Logo"}
                    className="max-h-16 max-w-48 object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeLogo}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  No logo uploaded
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Upload New Logo</Label>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLogoMutation.isPending}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploadLogoMutation.isPending ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-600">
              Supported formats: JPG, PNG, GIF, SVG. Maximum size: 5MB
            </p>
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
