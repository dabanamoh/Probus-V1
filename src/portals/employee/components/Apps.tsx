import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Calendar,
  MessageCircle,
  Plug,
  CheckCircle,
  Video
} from 'lucide-react';
import { useConnectedIntegrations } from '@/hooks/useIntegrations';

const Apps = () => {
  const { data: integrations = [], isLoading, error } = useConnectedIntegrations();
  const { toast } = useToast();

  // Map integration icon names to actual components
  const getIntegrationIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return Mail;
      case 'calendar': return Calendar;
      case 'message-circle': return MessageCircle;
      case 'video': return Video;
      default: return Plug;
    }
  };

  // Handle integration request
  const handleRequestIntegration = () => {
    toast({
      title: "Request Sent",
      description: "Your integration request has been sent to the administrator.",
    });
  };

  if (isLoading) {
    // ... existing loading code ...
    return (
      <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Integrated Apps</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Access your connected third-party applications</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 mb-2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded w-12 sm:w-16"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-full mb-3 sm:mb-4"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // ... existing error code ...
    return (
      <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Integrated Apps</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm sm:text-base text-red-700">Error loading integrations: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // ... existing main render code with all the cards and layouts ...
  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">Integrated Apps</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Access your organization's connected third-party applications</p>

        {integrations.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Plug className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Connected Apps</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">Your administrator hasn't connected any third-party applications yet.</p>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleRequestIntegration}
            >
              Request App Integration
            </Button>
          </div>
        ) : (
          <>
            {/* App Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm">Connected Apps</p>
                      <p className="text-xl sm:text-2xl font-bold">{integrations.length}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs sm:text-sm">Communication</p>
                      <p className="text-xl sm:text-2xl font-bold">{integrations.filter(app => app.category === 'Communication').length}</p>
                    </div>
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs sm:text-sm">Productivity</p>
                      <p className="text-xl sm:text-2xl font-bold">{integrations.filter(app => app.category === 'Project Management').length}</p>
                    </div>
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs sm:text-sm">Last Updated</p>
                      <p className="text-base sm:text-lg font-bold">Today</p>
                    </div>
                    <Plug className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connected Apps Grid */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">Available Applications</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">These applications have been connected by your administrator and are ready to use.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {integrations.map((integration) => {
                const IconComponent = getIntegrationIcon(integration.icon);

                return (
                  <Card key={integration.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 h-full flex flex-col">
                    <CardHeader className="pb-2 sm:pb-3 flex-shrink-0">
                      <div className="space-y-3">
                        {/* App info row */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-2 sm:p-3 bg-blue-100 rounded-xl flex-shrink-0">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg font-semibold truncate">{integration.name}</CardTitle>
                            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1 max-w-fit">{integration.category}</p>
                          </div>
                        </div>
                        {/* Status row */}
                        <div className="flex items-center gap-2 justify-end">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed flex-1">{integration.description}</p>
                      <div className="space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center mt-auto">
                        <div className="text-xs text-gray-500">
                          Connected: {new Date(integration.connectedAt!).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 flex items-center gap-1 w-full sm:w-auto justify-center"
                            onClick={() => {
                              // Open floating chat
                              window.dispatchEvent(new Event('openFloatingChat'));
                              toast({
                                title: "Opening Chat",
                                description: `${integration.name} is now available in the chat window.`,
                              });
                            }}
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Open Chat</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Help Section */}
            <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 self-start">
                  <Plug className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Need a New App Integration?</h3>
                  <p className="text-sm sm:text-base text-blue-700 mb-3 leading-relaxed">
                    If you need access to a specific application that isn't listed here,
                    you can request your administrator to add it.
                  </p>
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 w-full sm:w-auto text-sm sm:text-base"
                    onClick={handleRequestIntegration}
                  >
                    Request New Integration
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Apps;
