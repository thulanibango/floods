import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobeIcon, Shield } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-to-br from-slate-50 via-blue-200 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <GlobeIcon className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Flood Detection system</h1>
          </div>
          <p className="text-lg text-gray-600">A flood detection system is a system that is designed to detect the presence of floodwaters and alert people to the danger of flooding.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Flood Detection System</CardTitle>
              <Shield className="h-5 w-5 text-blue-500">Analysis methods</Shield>
            </CardHeader>
            <CardContent>


            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
