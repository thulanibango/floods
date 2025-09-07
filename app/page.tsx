"use client";

import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { Label } from "@radix-ui/react-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CameraIcon, GlobeIcon, ImageIcon, Loader2, MapPin, Shield, TrendingUpIcon, Upload, Map } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<'coordinates' | 'image'>('coordinates');
  const [mapError, setMapError] = useState(false);

  const imageUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")) {
        setAlertMessage(file.size > 10 * 1024 * 1024 ? "File size exceeds 10MB" : "File is not an image")
        setShowAlert(true);
        return;


      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };


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
              <Shield className="h-5 w-5 text-blue-500">Analysis methods , check</Shield>
            </CardHeader>
            <CardContent>
              <Tabs>
                <TabsList className="flex w-full gap-4">
                  <TabsTrigger value="coordinates" className="flex items-center gap-2 "><MapPin className="h-5 w-5 text-blue-500 h-4 w-4" /> Coordiantes</TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2 "><ImageIcon className="h-5 w-5 text-blue-500 h-4 w-4" /> Image Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="coordinates" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MapPin className="h-5 w-5 text-blue-500 h-4 w-4" />
                    <p>Coordiantes</p>
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        placeholder="Enter latitude"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        placeholder="Enter longitude"
                      />
                    </div>
                  </div>
                  <Button className="w-full"><MapPin className="mr-2 h-5 w-5 text-blue-500 h-4 w-4" /> analyse coordinates</Button>
                </TabsContent>
                <TabsContent value="image" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MapPin className="h-5 w-5 text-blue-500 h-4 w-4" />
                    <p>Image</p>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <p>Drag and drop an image or click to upload</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={imageUploadHandler} />
                        {!imagePreview ? (<div><div className="space-y-4"><Upload className="h-12 w-12 mx-auto text-slate-400" /><p className="text-slate-700 text-sm font-medium">UPLOAD TERRAIN IMAGE</p><p className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG, GIF, SVG</p></div><Button className="w-full" onClick={() => fileInputRef.current?.click()} variant={"outline"} size={"sm"}><CameraIcon className="mr-2 h-5 w-5 text-blue-500 h-4 w-4" />Upload image</Button></div>) : (<div className="space-y-4"><Image src={imagePreview} alt="Preview" width={200} height={200} /></div>)}
                      </div>
                    </div>

                  </div>
                  <Button className="w-full"><ImageIcon className="mr-2 h-5 w-5 text-blue-500 h-4 w-4" /> analyse Image</Button>
                </TabsContent>
              </Tabs>



            </CardContent>
          </Card>
          {/*result*/}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle><TrendingUpIcon /> Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <p className="text-slate-500 mt-1">{analysisType === 'coordinates' ? 'Analyzing coordinates...' : 'Analyzing image...'}</p>
                </div>)}
            </CardContent>
          </Card>

          {/*map area*/}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle><TrendingUpIcon /> Inteactive Map</CardTitle>
            </CardHeader>
            <CardContent>
              {mapError ? (
                <div className="w-full h-80 rounded-lg border border-slate-300 flex flex-col items-center justify-center py-12">
                  <Map className="h-16 w-16 text-slate-300 mb-4 " />
                  <h3 className="text-slate-500 mt-1">No map data available</h3>
                  <p className="text-slate-500 mt-1">Something went wrong, check your connection / api keys</p>
                </div>) : (
                <div className="w-full h-80 rounded-lg border border-slate-300 flex flex-col items-center justify-center py-12">
                  <Map className="h-16 w-16 text-slate-300 mb-4 " />
                  <h3 className="text-slate-500 mt-1">No map data available</h3>
                  <p className="text-slate-500 mt-1">Something went wrong, check your connection / api keys</p>
                </div>)}
            </CardContent>
          </Card>

        </div>
      </div>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
}

