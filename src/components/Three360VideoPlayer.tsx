import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Volume1,
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Eye, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export interface Video360Item {
  id: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  thumbnail: string;
  durationText: string;
  description: string;
  location: string;
  category: string;
}

interface Three360VideoPlayerProps {
  videos: Video360Item[];
  activeVideoId?: string;
  onSelectVideo?: (video: Video360Item) => void;
  lang?: 'th' | 'en';
}

export const Three360VideoPlayer: React.FC<Three360VideoPlayerProps> = ({
  videos,
  activeVideoId,
  onSelectVideo,
  lang = 'th'
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [activeVideo, setActiveVideo] = useState<Video360Item>(() => {
    return videos.find(v => v.id === activeVideoId) || videos[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [showVolumeToast, setShowVolumeToast] = useState<boolean>(false);
  const volumeToastTimerRef = useRef<number | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentFov, setCurrentFov] = useState<number>(75);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [gyroActive, setGyroActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync refs so Three.js render loop does not restart on state changes
  const isAutoRotatingRef = useRef<boolean>(isAutoRotating);
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  const gyroActiveRef = useRef<boolean>(gyroActive);
  useEffect(() => {
    gyroActiveRef.current = gyroActive;
  }, [gyroActive]);

  // Three.js internal references
  const threeRefs = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    sphereMesh: THREE.Mesh | null;
    videoTexture: THREE.VideoTexture | null;
    animationId: number | null;
    lon: number;
    lat: number;
    phi: number;
    theta: number;
    onPointerDownPointerX: number;
    onPointerDownPointerY: number;
    onPointerDownLon: number;
    onPointerDownLat: number;
    isUserInteracting: boolean;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    sphereMesh: null,
    videoTexture: null,
    animationId: null,
    lon: 0,
    lat: 0,
    phi: 0,
    theta: 0,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
    isUserInteracting: false
  });

  // Switch video if activeVideoId prop changes
  useEffect(() => {
    if (activeVideoId) {
      const found = videos.find(v => v.id === activeVideoId);
      if (found && found.id !== activeVideo.id) {
        setActiveVideo(found);
      }
    }
  }, [activeVideoId, videos, activeVideo.id]);

  // Format time (seconds -> mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Fullscreen change listener on document
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isFs);

      // Force Three.js renderer resize across the full window
      setTimeout(() => {
        if (!threeRefs.current.renderer || !threeRefs.current.camera) return;
        const w = isFs ? window.innerWidth : (containerRef.current?.clientWidth || 800);
        const h = isFs ? window.innerHeight : (containerRef.current?.clientHeight || 500);
        if (w > 0 && h > 0) {
          threeRefs.current.camera.aspect = w / h;
          threeRefs.current.camera.updateProjectionMatrix();
          threeRefs.current.renderer.setSize(w, h, true);
        }
      }, 80);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleFullscreenChange);
    };
  }, []);

  // Initialize Three.js scene & Video Texture
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);

    // 1. Create HTML5 Video Element
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    (video as any).webkitPlaysInline = true;
    video.loop = true;
    video.muted = isMuted;
    video.volume = volume;
    video.preload = 'auto';
    video.src = activeVideo.videoSrc;
    videoRef.current = video;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // 2. Setup Three.js Scene, Camera, Renderer
    const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
    const width = isFs ? window.innerWidth : (container.clientWidth || 800);
    const height = isFs ? window.innerHeight : (container.clientHeight || 500);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(currentFov, width / height, 1, 1200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, true);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Create Sphere Geometry and map Video Texture
    // Geometry with scale(-1, 1, 1) inverts normal so texture faces inwards
    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1);

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    threeRefs.current = {
      ...threeRefs.current,
      renderer,
      scene,
      camera,
      sphereMesh,
      videoTexture
    };

    // 4. Render loop
    const renderLoop = () => {
      threeRefs.current.animationId = requestAnimationFrame(renderLoop);

      // Auto-rotation when not interacting
      if (isAutoRotatingRef.current && !threeRefs.current.isUserInteracting && !gyroActiveRef.current) {
        threeRefs.current.lon += 0.08;
      }

      // Clamp latitude to prevent gimbal lock
      threeRefs.current.lat = Math.max(-85, Math.min(85, threeRefs.current.lat));

      const phi = THREE.MathUtils.degToRad(90 - threeRefs.current.lat);
      const theta = THREE.MathUtils.degToRad(threeRefs.current.lon);

      // Compass heading for UI (0-360)
      const normalizedLon = ((threeRefs.current.lon % 360) + 360) % 360;
      setCompassHeading(Math.round(normalizedLon));

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);
    };

    renderLoop();

    // 5. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const isNowFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      const w = isNowFs ? window.innerWidth : container.clientWidth;
      const h = isNowFs ? window.innerHeight : container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, true);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Auto-play muted video gently on load
    video.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });

    // Cleanup on unmount or video change
    return () => {
      if (threeRefs.current.animationId) {
        cancelAnimationFrame(threeRefs.current.animationId);
      }
      resizeObserver.disconnect();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.pause();
      video.src = '';
      video.load();

      videoTexture.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [activeVideo]);

  // Synchronize volume and mute states without reloading Three.js
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Adjust Camera FOV (Zoom)
  useEffect(() => {
    if (threeRefs.current.camera) {
      threeRefs.current.camera.fov = currentFov;
      threeRefs.current.camera.updateProjectionMatrix();
    }
  }, [currentFov]);

  // Drag interaction handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    threeRefs.current.isUserInteracting = true;
    threeRefs.current.onPointerDownPointerX = clientX;
    threeRefs.current.onPointerDownPointerY = clientY;
    threeRefs.current.onPointerDownLon = threeRefs.current.lon;
    threeRefs.current.onPointerDownLat = threeRefs.current.lat;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!threeRefs.current.isUserInteracting) return;
    const factor = (currentFov / 75) * 0.15;
    threeRefs.current.lon = (threeRefs.current.onPointerDownPointerX - clientX) * factor + threeRefs.current.onPointerDownLon;
    threeRefs.current.lat = (clientY - threeRefs.current.onPointerDownPointerY) * factor + threeRefs.current.onPointerDownLat;
  };

  const handlePointerUp = () => {
    threeRefs.current.isUserInteracting = false;
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Trigger volume HUD indicator
  const triggerVolumeToast = () => {
    setShowVolumeToast(true);
    if (volumeToastTimerRef.current) {
      clearTimeout(volumeToastTimerRef.current);
    }
    volumeToastTimerRef.current = window.setTimeout(() => {
      setShowVolumeToast(false);
    }, 1600);
  };

  // Continuous volume adjustment (0.0 to 1.0)
  const handleVolumeChange = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    if (clamped === 0) {
      setIsMuted(true);
      if (videoRef.current) videoRef.current.muted = true;
    } else {
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = clamped;
      }
    }
    triggerVolumeToast();
  };

  // Step volume by delta (+0.1 or -0.1)
  const handleStepVolume = (delta: number) => {
    const base = isMuted ? 0 : volume;
    const next = Math.round(Math.max(0, Math.min(1, base + delta)) * 100) / 100;
    handleVolumeChange(next);
  };

  // Mute / Unmute Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      const restored = volume === 0 ? 0.8 : volume;
      setVolume(restored);
      setIsMuted(false);
      videoRef.current.muted = false;
      videoRef.current.volume = restored;
    } else {
      setIsMuted(true);
      videoRef.current.muted = true;
    }
    triggerVolumeToast();
  };

  // Keyboard shortcut listener for Volume (ArrowUp to increase, ArrowDown to decrease, M to mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleStepVolume(0.05);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleStepVolume(-0.05);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isMuted]);

  // Seek bar scrub
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  // Reset view angle
  const handleResetView = () => {
    threeRefs.current.lon = 0;
    threeRefs.current.lat = 0;
    setCurrentFov(75);
  };

  // Toggle Fullscreen with full vendor support
  const toggleFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;

    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Device orientation / Gyroscope Toggle (for phones)
  const toggleGyro = async () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setGyroActive(prev => !prev);
        }
      } catch (err) {
        console.warn('Gyro permission rejected:', err);
      }
    } else {
      setGyroActive(prev => !prev);
    }
  };

  useEffect(() => {
    if (!gyroActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null) {
        threeRefs.current.lon = -e.alpha;
        threeRefs.current.lat = Math.max(-85, Math.min(85, e.beta - 90));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gyroActive]);

  return (
    <div className="space-y-6">
      
      {/* 360 Video Player Stage (Expands to 100vw x 100vh when Fullscreen) */}
      <div 
        ref={stageRef}
        className={
          isFullscreen
            ? "fixed inset-0 z-[99999] w-screen h-screen bg-black flex flex-col justify-center items-center overflow-hidden select-none"
            : "relative rounded-3xl overflow-hidden bg-stone-950 border-4 border-[#00435c]/30 shadow-2xl group select-none"
        }
      >
        
        {/* Top Info Bar */}
        <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 sm:p-5 flex items-center justify-between text-white pointer-events-auto">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fe9666] text-[#1d1b16] font-bold text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>360° Spherical VR Video</span>
            </span>
            <div className="min-w-0">
              <h3 className="font-serif-thai font-bold text-sm sm:text-base text-white truncate drop-shadow-sm">
                {activeVideo.title}
              </h3>
              <p className="text-xs text-[#c3e8ff] truncate hidden sm:block">
                {activeVideo.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Compass Heading Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-mono text-[#fe9666]">
              <Compass className="w-3.5 h-3.5" />
              <span>{compassHeading}°</span>
            </div>

            {/* Mobile Gyro button */}
            <button
              onClick={toggleGyro}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                gyroActive 
                  ? 'bg-[#fe9666] text-[#1d1b16]' 
                  : 'bg-black/60 hover:bg-black/80 text-white border border-white/15'
              }`}
              title="เปิด/ปิดการควบคุมด้วยการขยับมือถือ (Gyroscope)"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Quick Fullscreen button on top right as well */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/15 cursor-pointer transition-all"
              title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'เปิดแบบเต็มจอ'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-[#fe9666]" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* The Three.js WebGL Container (fills 100% height and width in fullscreen!) */}
        <div 
          ref={containerRef}
          className={
            isFullscreen 
              ? "w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing bg-black"
              : "w-full h-[400px] sm:h-[500px] lg:h-[620px] cursor-grab active:cursor-grabbing bg-stone-950 relative"
          }
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handlePointerUp}
        />

        {/* Center Big Play Button Overlay when paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-[#fe9666] text-[#1d1b16] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-white gap-3">
            <RotateCw className="w-6 h-6 animate-spin text-[#fe9666]" />
            <span className="text-sm font-semibold">กำลังโหลดวิดีโอ 360°...</span>
          </div>
        )}

        {/* Drag Hint on Center Screen */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
          <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-stone-200 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#fe9666]" />
            <span>คลิก/สัมผัสลากเพื่อหมุนดูรอบทิศทาง 360 องศา</span>
          </div>
        </div>

        {/* Floating Volume Toast Indicator (pops up when volume changes) */}
        {showVolumeToast && (
          <div className="absolute top-20 right-5 z-30 pointer-events-none transition-all duration-300">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-2xl">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume <= 0.5 ? (
                <Volume1 className="w-4 h-4 text-[#fe9666]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#fe9666]" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold">
                  {isMuted ? 'ปิดเสียง (Muted)' : `ระดับเสียง ${Math.round(volume * 100)}%`}
                </span>
                <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-[#fe9666] transition-all duration-100 rounded-full"
                    style={{ width: `${isMuted ? 0 : Math.round(volume * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-5 space-y-3 pointer-events-auto">
          
          {/* Progress & Scrub Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-300 w-11 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-stone-700/80 rounded-lg appearance-none cursor-pointer accent-[#fe9666] hover:h-2 transition-all"
            />
            <span className="text-xs font-mono text-stone-400 w-11">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Tools Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors cursor-pointer"
                title={isPlaying ? 'พักชั่วคราว' : 'เล่นวิดีโอ'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              {/* Comprehensive Volume Controls (เพิ่ม/ลดเสียง และ ปิด/เปิดเสียง) */}
              <div 
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/20 backdrop-blur-md px-2 sm:px-2.5 py-1.5 rounded-xl border border-white/10 transition-colors"
                title="ระบบควบคุมเสียง: แถบปรับเสียง, ปุ่มเพิ่ม/ลดเสียง (+/-), หรือใช้ปุ่มลูกศรขึ้น/ลงบนคีย์บอร์ด"
              >
                {/* Mute/Unmute Toggle */}
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isMuted ? 'เปิดเสียง (คลิกเพื่อเปิด)' : 'ปิดเสียง (คลิกเพื่อปิด)'}
                  aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-stone-400" />
                  ) : volume <= 0.5 ? (
                    <Volume1 className="w-4 h-4 text-[#fe9666]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#fe9666]" />
                  )}
                </button>

                {/* Decrease Volume (-) */}
                <button
                  onClick={() => handleStepVolume(-0.1)}
                  className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer select-none"
                  title="ลดเสียง 10% (หรือกดลูกศรลง)"
                  aria-label="ลดระดับเสียง"
                >
                  -
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-14 sm:w-20 md:w-24 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#fe9666] hover:h-2 transition-all"
                    title={`ระดับเสียง: ${isMuted ? 'ปิดเสียง (0%)' : `${Math.round(volume * 100)}%`}`}
                    aria-label="แถบปรับระดับเสียง"
                  />
                  <span className="text-[11px] font-mono font-medium text-stone-300 w-7 sm:w-8 text-right select-none">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>

                {/* Increase Volume (+) */}
                <button
                  onClick={() => handleStepVolume(0.1)}
                  className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer select-none"
                  title="เพิ่มเสียง 10% (หรือกดลูกศรขึ้น)"
                  aria-label="เพิ่มระดับเสียง"
                >
                  +
                </button>
              </div>

              {/* Auto-rotate Toggle */}
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer ${
                  isAutoRotating
                    ? 'bg-[#00435c] text-white border border-[#c3e8ff]/30'
                    : 'bg-white/15 text-stone-300 hover:bg-white/25'
                }`}
                title="หมุนรอบ 360 องศาอัตโนมัติ"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin-slow' : ''}`} />
                <span className="hidden sm:inline">{isAutoRotating ? 'หมุน 360° อัตโนมัติ' : 'หมุนอัตโนมัติ'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset to 0° */}
              <button
                onClick={handleResetView}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-mono text-stone-200 backdrop-blur-md cursor-pointer"
                title="รีเซ็ตมุมมองกลับมาตรงกลาง"
              >
                0° กลาง
              </button>

              {/* Zoom In */}
              <button
                onClick={() => setCurrentFov(prev => Math.max(prev - 10, 45))}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors cursor-pointer"
                title="ขยายมุมมอง (Zoom In)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Zoom Out */}
              <button
                onClick={() => setCurrentFov(prev => Math.min(prev + 10, 95))}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors cursor-pointer"
                title="ย่อมิติภาพ (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors cursor-pointer"
                title={isFullscreen ? 'ย่อหน้าต่างกลับ' : 'เปิดแบบเต็มหน้าจอ'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4 text-[#fe9666]" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Video Selection Playlist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#00435c] text-sm sm:text-base">
              เลือกชมวิดีโอ 360° คลองบางหลวง ({videos.length} คลิป)
            </span>
          </div>
          <span className="text-xs text-[#71787e]">
            คลิกที่คลิปเพื่อเริ่มเล่นรอบทิศทาง
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((vid, idx) => {
            const isSelected = vid.id === activeVideo.id;
            return (
              <div
                key={vid.id}
                onClick={() => {
                  setActiveVideo(vid);
                  onSelectVideo?.(vid);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#00435c] text-white border-[#00435c] shadow-lg scale-[1.01]'
                    : 'bg-white hover:bg-[#f9f3ea] text-[#1d1b16] border-[#e8e2d9] shadow-xs'
                }`}
              >
                <div className="relative rounded-xl overflow-hidden aspect-video bg-stone-900 shadow-inner">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#fe9666] text-[#1d1b16]' : 'bg-black/60 text-white'
                    }`}>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-white">
                    {vid.durationText}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#fe9666] text-[#1d1b16] text-[10px] font-bold">
                    360° VR #{idx + 1}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className={`font-serif-thai font-bold text-sm line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-[#00435c]'
                  }`}>
                    {vid.title}
                  </h4>
                  <p className={`text-xs line-clamp-2 ${
                    isSelected ? 'text-[#c3e8ff]' : 'text-[#71787e]'
                  }`}>
                    {vid.description}
                  </p>
                </div>

                <div className={`pt-2 border-t text-[11px] flex items-center justify-between ${
                  isSelected ? 'border-white/20 text-[#fe9666]' : 'border-stone-100 text-stone-500'
                }`}>
                  <span>{vid.location}</span>
                  <span className="font-semibold">{vid.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
