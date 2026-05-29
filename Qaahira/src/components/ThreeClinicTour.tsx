import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MoveLeft, MoveRight, HelpCircle, Eye, CheckCircle2, ChevronRight, Sparkles, Search, Map, Sliders, Layers, Info } from "lucide-react";
import { TourHotspot } from "../types";

const CLINIC_HOTSPOTS: TourHotspot[] = [
  {
    id: "reception",
    title: "Eco-Lounge Reception & Registration",
    description: "Welcome to Qahira Clinic. Our welcoming entry features low-energy biological air filters, warm wood accents, and direct touchless check-ins.",
    position: [-2.5, 0.4, 1.8],
    details: "Upon arrival, register securely using our paperless kiosks. Clinic staff will verify any medical pre-clearances and lead you to your consult."
  },
  {
    id: "reception-portal",
    title: "Reception Self-Service Check-In Console",
    description: "An interactive touchless kiosk stationed at the entrance for automated queue management and digital consent forms.",
    position: [-1.8, 0.4, 2.5],
    details: "Equipped with secure facial registration options, medical history intake questionnaires, and direct insurance verification processors."
  },
  {
    id: "reception-air",
    title: "Reception Circadian Bioregenerative Room Air Purifier",
    description: "An air purification unit using double-HEPA filtration and biological phytoremediation to continuously sterilize clinic air.",
    position: [-3.0, 0.5, 1.2],
    details: "Captures 99.97% of sub-micron biological aerosols, utilizing built-in light panels that simulate gentle sunrise/sunset wavelengths to ease visitor anxiety."
  },
  {
    id: "reception-waiting",
    title: "Eco-Lounge Patients' Waiting Area",
    description: "A tranquil relaxation zone equipped with organic air filters, premium herbal tea station, and ergonomic therapeutic seating.",
    position: [-3.5, 0.2, 0.4],
    details: "Features circadian adaptive lighting mimicking natural light cycles and binaural audio therapy to minimize any procedural anxiety naturally."
  },
  {
    id: "denture-chair",
    title: "Ergonomic Comfort-First Operatory Desk",
    description: "Our examination suites use ultra-soft memory foam dental chairs designed to alleviate standard lumbar stress and support longer appointments comfortably.",
    position: [0, -0.2, -1.2],
    linkedServiceId: "root-canal",
    details: "Features overhead warm daylight LEDs (to prevent patient retina fatigue) and integrated quiet high-torque dental motors that cut sound pollution by 70%."
  },
  {
    id: "cbct-scan",
    title: "Low-Dose Computerized CBCT 3D Scanner",
    description: "We use ultra-modern cone beam computed tomography to render highly precise 3D bone reconstructions of your dental roots and sinuses.",
    position: [2.5, 0.5, 0.8],
    linkedServiceId: "root-canal",
    linkedDoctorId: "dr-youssef",
    details: "Requires up to 90% less ionizing radiation than traditional medical CT machines, capturing full volumetric jaws in just a single 12-second run."
  },
  {
    id: "sterilization",
    title: "Class-B Autoclave Sterilization Hub",
    description: "Our medical sterilization corridor runs high-vacuum thermo-autoclaves to guarantee 100% biological safety and control.",
    position: [-1.2, 0.8, -2.5],
    details: "All surgical sets are sealed, barcode-scanned to track sterile statuses, and pressure-decontaminated before clinical placement."
  },
  {
    id: "sterilization-autoclave-cycle",
    title: "Sterilization Autoclave High-Vacuum Pressure Chamber",
    description: "Advanced steam-sterilization chamber executing type-B fractionated pre-vacuum air removal for maximum steam penetration.",
    position: [-1.8, 0.6, -2.2],
    details: "Heats up to 134°C inside a dual-walled vacuum chamber, ensuring complete bactericidal, virucidal, and sporicidal cell destruction on instrument kits."
  },
  {
    id: "sterilization-prep",
    title: "Ultrasonic Presoak & Decontamination Station",
    description: "Advanced medical-grade first-stage instrument presoak, ultrasonic cleaning, and mechanical diagnostics.",
    position: [-0.6, 0.7, -3.2],
    details: "This automated phase removes sub-micron medical debris using high-frequency enzyme scrubbing prior to autoclaved thermal sterilization."
  },
  {
    id: "sterilization-test",
    title: "Sterilization Weekly Spore Incubator Verification Station",
    description: "Biological incubator used to cultivate test spore vials, verifying sterilizer performance against heavy bacterial spores.",
    position: [-0.6, 0.5, -3.8],
    details: "Weekly biologic spore validation ensures autoclave temperatures and vacuum are 100% adequate to eradicate highly resistant Geobacillus stearothermophilus spores."
  }
];

interface ToothLayer {
  id: string;
  title: string;
  description: string;
  details: string;
}

const TOOTH_LAYERS: ToothLayer[] = [
  {
    id: "enamel",
    title: "1. Calcium-Hardened Enamel Crown",
    description: "The highly mineralized protective outer shield of the dental crown. Translucent and crystalline under clinical lighting.",
    details: "Enamel is the hardest tissue in human biology. Because it has no living cells, it cannot biologically self-regenerate, making proactive mineral fluoride barriers and professional check-ups essential."
  },
  {
    id: "dentin",
    title: "2. Circadian Bio-Dentin Matrix",
    description: "The resilient yellow shock-absorbing support structure containing billing of microscopic sensory tubules.",
    details: "Formed continuously by odontoblasts, Dentin buffers heavy bite force. If outer enamel erodes, heat or cold stimuli travel directly along the tubules to the nerve, triggering acute clinical sensitivity."
  },
  {
    id: "pulp",
    title: "3. Diagnostic Nerve Pulp Chamber",
    description: "The living soft-tissue core containing specialized dental cells, micro-capillaries, and active sensory nerves.",
    details: "This neural chamber fuels the tooth during growth. If breached by bacterial decay, biological infections are resolved with micro-sterilized painless endodontics (root canals), keeping the natural shell intact."
  },
  {
    id: "roots",
    title: "4. Anchoring Roots & Cementum",
    description: "Twin lower structural anchorage prongs covered in cementum that secure the tooth deep inside the jaw bone.",
    details: "Secured to the bone via millions of periodontal collagen suspension fibers. In complete loss, surgical titanium implants or screws are placed to mimic these natural root anchors, preventing bone regression."
  },
  {
    id: "gums",
    title: "5. Alveolar Bone & Periodontal Gums",
    description: "The supportive rose-colored mucosal shield protecting base roots and surrounding structural bone.",
    details: "Acts as a biological gasket maintaining oral integrity. Keeps anaerobic bacterial communities out of the blood channels. Strengthened via professional bio-scaling treatments."
  }
];

interface ThreeClinicTourProps {
  onLinkToService: (serviceId: string) => void;
  onLinkToDoctor: (doctorId: string) => void;
}

export default function ThreeClinicTour({ onLinkToService, onLinkToDoctor }: ThreeClinicTourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coneRef = useRef<SVGGElement | null>(null);

  // References
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  
  // Interactive object trackers
  const rotationGroupRef = useRef<THREE.Group | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const hotspotMeshesRef = useRef<{ [id: string]: THREE.Mesh }>({});
  const toothMeshesRef = useRef<{ [id: string]: THREE.Mesh | THREE.Group }>({});
  
  // States
  const [tourMode, setTourMode] = useState<"walkthrough" | "tooth">("walkthrough");
  const [selectedHotspot, setSelectedHotspot] = useState<TourHotspot | null>(CLINIC_HOTSPOTS[0]);
  const [selectedToothLayer, setSelectedToothLayer] = useState<string>("enamel");
  const [enamelOpacity, setEnamelOpacity] = useState<number>(0.55); // slide transparency
  const [cameraAngle, setCameraAngle] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Rotate camera manually using buttons
  const rotateCamera = (direction: "left" | "right") => {
    if (tourMode === "walkthrough" && rotationGroupRef.current) {
      const step = direction === "left" ? 0.4 : -0.4;
      rotationGroupRef.current.rotation.y += step;
      setCameraAngle(prev => prev + step * (180 / Math.PI));
    } else if (tourMode === "tooth" && toothGroupRef.current) {
      const step = direction === "left" ? 0.4 : -0.4;
      toothGroupRef.current.rotation.y += step;
    }
  };

  // Mouse pan triggers
  const isDragging = useRef(false);
  const prevMousePosition = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMousePosition.current.x;
    
    if (tourMode === "walkthrough" && rotationGroupRef.current) {
      rotationGroupRef.current.rotation.y += deltaX * 0.005;
    } else if (tourMode === "tooth" && toothGroupRef.current) {
      toothGroupRef.current.rotation.y += deltaX * 0.01;
    }
    
    prevMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Select a hotspot from sidebar, clicks, or minimap
  const selectHotspot = (hotspot: TourHotspot) => {
    setSelectedHotspot(hotspot);

    // Briefly pulse the 3D mesh corresponding to this hotspot
    const mesh = hotspotMeshesRef.current[hotspot.id];
    if (mesh) {
      mesh.scale.set(1.6, 1.6, 1.6);
      setTimeout(() => {
        mesh.scale.set(1.0, 1.0, 1.0);
      }, 300);
    }

    // Orient camera rotation slightly towards this hotspot in 3D for standard feedback
    if (rotationGroupRef.current) {
      const angle = Math.atan2(hotspot.position[0], hotspot.position[2]);
      rotationGroupRef.current.rotation.y = -angle;
    }
  };

  // Filter hotspots based on search query
  const filteredHotspots = CLINIC_HOTSPOTS.filter((spot) => {
    const q = searchQuery.toLowerCase();
    return (
      spot.title.toLowerCase().includes(q) ||
      spot.description.toLowerCase().includes(q) ||
      (spot.details && spot.details.toLowerCase().includes(q))
    );
  });

  // Convert 3D hotspot coordinates into 2D SVG map projection coordinate space (100x100)
  const getSvgCoords = (pos: [number, number, number]) => {
    // Map X [-4, 4] and Z [-4, 4] coordinates into [15, 85] viewBox scale
    const x = pos[0];
    const z = pos[2];
    const mapX = 50 + (x / 4) * 35;
    const mapY = 50 + (z / 4) * 35;
    return { x: mapX, y: mapY };
  };

  // Synchronize 3D variables to states on rendering
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Create 3D Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080c18"); // deep blue cyber layout
    sceneRef.current = scene;

    // Camera setup (Looking outward from the center)
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    camera.position.set(0, 0.5, 0.1); // at center
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Interactive Group containing the room elements
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    rotationGroupRef.current = roomGroup;

    // INTERACTIVE PROCEDURAL 3D MO_ANATOMY TOOTH
    const toothGroup = new THREE.Group();
    toothGroup.position.set(0, -0.1, 0);
    scene.add(toothGroup);
    toothGroupRef.current = toothGroup;

    // Default visibility
    toothGroup.visible = false;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight("#4f6991", 1.5);
    scene.add(ambientLight);

    const clinicSpot1 = new THREE.DirectionalLight("#e0f2fe", 1.8);
    clinicSpot1.position.set(3, 5, 2);
    roomGroup.add(clinicSpot1);

    const futuristicBlueAccent = new THREE.PointLight("#00f0ff", 3, 10);
    futuristicBlueAccent.position.set(0, 2, 0);
    roomGroup.add(futuristicBlueAccent);

    // Dynamic key light for the tooth explorer
    const toothKeyLight = new THREE.DirectionalLight("#ffffff", 2.0);
    toothKeyLight.position.set(-2, 3, 4);
    scene.add(toothKeyLight);

    // PROCEDURAL CLINIC Blueprint Mesh representations
    const floorGeom = new THREE.RingGeometry(2, 6, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#0a1f44",
      side: THREE.DoubleSide,
      wireframe: true
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = Math.PI / 2;
    floorMesh.position.y = -0.5;
    roomGroup.add(floorMesh);

    // Large wireframe cylinder detailing room boundaries
    const wallsGeom = new THREE.CylinderGeometry(5, 5, 3.5, 24, 4, true);
    const wallsMat = new THREE.MeshStandardMaterial({
      color: "#1e3a8a",
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const walls = new THREE.Mesh(wallsGeom, wallsMat);
    walls.position.y = 1;
    roomGroup.add(walls);

    // Add visual placeholders of clinical equipment structures
    // 1. Reception counter
    const counterBox = new THREE.BoxGeometry(1.5, 0.8, 0.6);
    const counterMat = new THREE.MeshStandardMaterial({ color: "#1e293b", wireframe: false });
    const counter = new THREE.Mesh(counterBox, counterMat);
    counter.position.set(-2.5, 0.0, 1.8);
    roomGroup.add(counter);

    // 2. Comfortable dental chair
    const chairBack = new THREE.BoxGeometry(0.8, 0.15, 1.6);
    const chairMat = new THREE.MeshStandardMaterial({ color: "#ffcbd4", roughness: 0.2 }); // comfortable coral pink chair
    const dentalChair = new THREE.Mesh(chairBack, chairMat);
    dentalChair.position.set(0, -0.4, -1.2);
    dentalChair.rotation.set(-Math.PI / 6, 0.2, 0.1);
    roomGroup.add(dentalChair);

    // 3. Cylinder CBCT scanner column
    const scanGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 12);
    const scanMat = new THREE.MeshStandardMaterial({ color: "#312e81", wireframe: true });
    const scanner = new THREE.Mesh(scanGeom, scanMat);
    scanner.position.set(2.5, 0.4, 0.8);
    roomGroup.add(scanner);

    // 4. Autoclave box
    const autocGeom = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const autoclMesh = new THREE.Mesh(autocGeom, scanMat);
    autoclMesh.position.set(-1.2, 0.3, -2.5);
    roomGroup.add(autoclMesh);

    // 5. Patient Lounge Waiting Bench (for reception-waiting)
    const benchGeom = new THREE.BoxGeometry(1.4, 0.4, 0.6);
    const benchMat = new THREE.MeshStandardMaterial({ color: "#1e1b4b", wireframe: false });
    const bench = new THREE.Mesh(benchGeom, benchMat);
    bench.position.set(-3.5, -0.3, 0.4);
    roomGroup.add(bench);

    // 6. Ultrasonic Cleaning Sink Unit (for sterilization-prep)
    const sinkGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 12);
    const sinkMat = new THREE.MeshStandardMaterial({ color: "#475569", wireframe: true });
    const sink = new THREE.Mesh(sinkGeom, sinkMat);
    sink.position.set(-0.6, 0.2, -3.2);
    roomGroup.add(sink);

    // 7. self-service concierge screen structure (reception-portal)
    const flatBoxGeom = new THREE.BoxGeometry(0.1, 0.5, 0.4);
    const screenMat = new THREE.MeshStandardMaterial({ color: "#eb9020" });
    const screenObj = new THREE.Mesh(flatBoxGeom, screenMat);
    screenObj.position.set(-1.8, 0.3, 2.5);
    screenObj.rotation.y = Math.PI / 4;
    roomGroup.add(screenObj);

    // 8. Air treatment tower (reception-air)
    const airTowerGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 12);
    const greyTowerMat = new THREE.MeshStandardMaterial({ color: "#10b981", wireframe: true });
    const airTowerObj = new THREE.Mesh(airTowerGeom, greyTowerMat);
    airTowerObj.position.set(-3.0, 0.2, 1.2);
    roomGroup.add(airTowerObj);

    // 9. Biological Spore incubator cylinder (sterilization-test)
    const incubatorGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 10);
    const goldMat = new THREE.MeshStandardMaterial({ color: "#f59e0b" });
    const incubatorObj = new THREE.Mesh(incubatorGeom, goldMat);
    incubatorObj.position.set(-0.6, 0.3, -3.8);
    roomGroup.add(incubatorObj);


    // RENDER INTERACTIVE FLOATING 3D HOTSPOT BEACONS
    CLINIC_HOTSPOTS.forEach((spot) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(spot.position[0], spot.position[1] + 0.3, spot.position[2]);

      // Core glowing sphere
      const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: "#1cb2ff",
        roughness: 0.1,
        emissive: "#1cb2ff",
        emissiveIntensity: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      beaconGroup.add(sphere);

      // Outer wireframe orbiting ring
      const ringGeom = new THREE.RingGeometry(0.25, 0.32, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.name = "orbit_ring";
      beaconGroup.add(ring);

      roomGroup.add(beaconGroup);

      // Map references
      hotspotMeshesRef.current[spot.id] = sphere;
    });


    // --- CONSTRUCT THE 3D MO_ANATOMY TOOTH ---
    // Materials
    const enamelMat = new THREE.MeshStandardMaterial({
      color: "#f8fafc",
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: enamelOpacity,
      side: THREE.DoubleSide
    });

    const dentinMat = new THREE.MeshStandardMaterial({
      color: "#fefe9a",
      roughness: 0.35,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const pulpMat = new THREE.MeshStandardMaterial({
      color: "#ef4444",
      roughness: 0.2,
      emissive: "#ef4444",
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 1
    });

    const rootMat = new THREE.MeshStandardMaterial({
      color: "#f1f5f9",
      roughness: 0.5,
      transparent: true,
      opacity: 0.95
    });

    const gumMat = new THREE.MeshStandardMaterial({
      color: "#fda4af",
      roughness: 0.4,
      metalness: 0.05
    });

    // 1. ENAMEL (CROWN) GROUP NODE
    const enamelGroup = new THREE.Group();
    // Molar crown base
    const enamelBaseGeom = new THREE.CylinderGeometry(0.85, 0.72, 0.8, 20, 3, false);
    const enamelBaseMesh = new THREE.Mesh(enamelBaseGeom, enamelMat);
    enamelBaseMesh.position.y = 0.45;
    enamelGroup.add(enamelBaseMesh);

    // Molar cusps (4 spherical bumps at the top of the crown)
    const cuspGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const cuspOffsets = [
      [0.26, 0.82, 0.26],
      [-0.26, 0.82, 0.26],
      [0.26, 0.82, -0.26],
      [-0.26, 0.82, -0.26]
    ];
    cuspOffsets.forEach(([x, y, z]) => {
      const cuspMesh = new THREE.Mesh(cuspGeom, enamelMat);
      cuspMesh.position.set(x, y, z);
      enamelGroup.add(cuspMesh);
    });
    toothGroup.add(enamelGroup);
    toothMeshesRef.current["enamel"] = enamelGroup;

    // 2. DENTIN GROUP NODE
    const dentinGroup = new THREE.Group();
    const dentinBaseGeom = new THREE.CylinderGeometry(0.65, 0.55, 0.7, 16, 2);
    const dentinBaseMesh = new THREE.Mesh(dentinBaseGeom, dentinMat);
    dentinBaseMesh.position.y = 0.42;
    dentinGroup.add(dentinBaseMesh);

    const dentinCuspGeom = new THREE.SphereGeometry(0.24, 12, 12);
    const dentinCuspOffsets = [
      [0.18, 0.72, 0.18],
      [-0.18, 0.72, 0.18],
      [0.18, 0.72, -0.18],
      [-0.18, 0.72, -0.18]
    ];
    dentinCuspOffsets.forEach(([x, y, z]) => {
      const dCuspMesh = new THREE.Mesh(dentinCuspGeom, dentinMat);
      dCuspMesh.position.set(x, y, z);
      dentinGroup.add(dCuspMesh);
    });
    toothGroup.add(dentinGroup);
    toothMeshesRef.current["dentin"] = dentinGroup;

    // 3. PULP GROUP NODE
    const pulpGroup = new THREE.Group();
    const pulpChamberGeom = new THREE.CylinderGeometry(0.24, 0.18, 0.45, 12);
    const pulpChamberMesh = new THREE.Mesh(pulpChamberGeom, pulpMat);
    pulpChamberMesh.position.y = 0.38;
    pulpGroup.add(pulpChamberMesh);

    const canalGeom1 = new THREE.CylinderGeometry(0.06, 0.02, 1.1, 8);
    const canal1 = new THREE.Mesh(canalGeom1, pulpMat);
    canal1.position.set(-0.24, -0.15, 0);
    canal1.rotation.z = 0.22;
    pulpGroup.add(canal1);

    const canal2 = new THREE.Mesh(canalGeom1, pulpMat);
    canal2.position.set(0.24, -0.15, 0);
    canal2.rotation.z = -0.22;
    pulpGroup.add(canal2);
    toothGroup.add(pulpGroup);
    toothMeshesRef.current["pulp"] = pulpGroup;

    // 4. ROOTS GROUP NODE
    const rootsGroup = new THREE.Group();
    const rootGeom1 = new THREE.CylinderGeometry(0.35, 0.08, 1.25, 14);
    const leftRoot = new THREE.Mesh(rootGeom1, rootMat);
    leftRoot.position.set(-0.26, -0.2, 0);
    leftRoot.rotation.z = 0.22;
    rootsGroup.add(leftRoot);

    const rightRoot = new THREE.Mesh(rootGeom1, rootMat);
    rightRoot.position.set(0.26, -0.2, 0);
    rightRoot.rotation.z = -0.22;
    rootsGroup.add(rightRoot);
    toothGroup.add(rootsGroup);
    toothMeshesRef.current["roots"] = rootsGroup;

    // 5. GUMS BASE NODE
    const gumGeom = new THREE.CylinderGeometry(1.3, 1.45, 0.25, 24);
    const gumMesh = new THREE.Mesh(gumGeom, gumMat);
    gumMesh.position.set(0, 0.05, 0);
    toothGroup.add(gumMesh);
    toothMeshesRef.current["gums"] = gumMesh;


    // 3D ANIMATION LOOP
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate hot spots orbits and let room slowly rotate if not dragging
      if (!isDragging.current) {
        if (roomGroup.visible) {
          roomGroup.rotation.y += 0.0012;
        } else if (toothGroup.visible) {
          toothGroup.rotation.y += 0.005; // slowly rotate tooth anatomy
        }
      }

      // Spin the rings on all beacons
      if (roomGroup.visible) {
        roomGroup.children.forEach((child) => {
          if (child instanceof THREE.Group) {
            const orbit = child.getObjectByName("orbit_ring");
            if (orbit) {
              orbit.rotation.z += 0.04;
              orbit.rotation.y += 0.01;
            }
          }
        });

        // Synchronize the radar SVG's swept cone rotation with the 3D scene camera rotation smoothly
        if (coneRef.current && roomGroup) {
          const angleDeg = -(roomGroup.rotation.y * 180) / Math.PI;
          coneRef.current.setAttribute("transform", `rotate(${angleDeg}, 50, 50)`);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Modify 3D Tooth highlight and translucency on State change in real time
  useEffect(() => {
    if (rotationGroupRef.current) {
      rotationGroupRef.current.visible = tourMode === "walkthrough";
    }
    if (toothGroupRef.current) {
      toothGroupRef.current.visible = tourMode === "tooth";
    }

    if (tourMode === "tooth") {
      const enamelGrp = toothMeshesRef.current["enamel"];
      const dentinGrp = toothMeshesRef.current["dentin"];
      const pulpGrp = toothMeshesRef.current["pulp"];
      const rootsGrp = toothMeshesRef.current["roots"];
      const gumsMesh = toothMeshesRef.current["gums"];

      // 1. Enamel Opaqueness slider adjust and glow
      if (enamelGrp) {
        enamelGrp.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = true;
            child.material.opacity = enamelOpacity;
            
            if (selectedToothLayer === "enamel") {
              child.material.emissive.set("#3b82f6");
              child.material.emissiveIntensity = 0.45;
            } else {
              child.material.emissive.set("#000000");
              child.material.emissiveIntensity = 0;
            }
          }
        });
      }

      // 2. Dentin Layer
      if (dentinGrp) {
        dentinGrp.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            if (selectedToothLayer === "dentin") {
              child.material.emissive.set("#eab308");
              child.material.emissiveIntensity = 0.5;
            } else {
              child.material.emissive.set("#000000");
              child.material.emissiveIntensity = 0;
            }
          }
        });
      }

      // 3. Pulp level
      if (pulpGrp) {
        pulpGrp.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            if (selectedToothLayer === "pulp") {
              child.material.emissive.set("#ef4444");
              child.material.emissiveIntensity = 0.95;
            } else {
              child.material.emissive.set("#ef4444");
              child.material.emissiveIntensity = 0.35; // base core bio glow
            }
          }
        });
      }

      // 4. Roots
      if (rootsGrp) {
        rootsGrp.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            if (selectedToothLayer === "roots") {
              child.material.emissive.set("#60a5fa");
              child.material.emissiveIntensity = 0.5;
            } else {
              child.material.emissive.set("#000000");
              child.material.emissiveIntensity = 0;
            }
          }
        });
      }

      // 5. Gums
      if (gumsMesh && gumsMesh instanceof THREE.Mesh && gumsMesh.material instanceof THREE.MeshStandardMaterial) {
        if (selectedToothLayer === "gums") {
          gumsMesh.material.emissive.set("#f43f5e");
          gumsMesh.material.emissiveIntensity = 0.45;
        } else {
          gumsMesh.material.emissive.set("#000000");
          gumsMesh.material.emissiveIntensity = 0;
        }
      }
    }
  }, [tourMode, selectedToothLayer, enamelOpacity]);

  const activeLayerMeta = TOOTH_LAYERS.find((lvl) => lvl.id === selectedToothLayer);

  return (
    <div className="flex flex-col gap-5 w-full bg-[#030712] border border-brand-900/15 rounded-3xl p-4 lg:p-6" id="three-clinic-tour-wrapper">
      
      {/* 2D Interactive Tab selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-brand-950/50">
        <div>
          <h2 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500 animate-pulse" />
            3D Diagnostic Walking Tour & Anatomy Simulator
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Switch modes to explore either our biological clinic layout or examine real-time cross-sections of a 3D tooth.
          </p>
        </div>

        <div className="flex bg-[#070b14] border border-brand-950 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setTourMode("walkthrough")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-sans font-extrabold flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
              tourMode === "walkthrough"
                ? "bg-brand-600 text-white shadow-lg"
                : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            360° Clinic Tour
          </button>
          <button
            onClick={() => setTourMode("tooth")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-sans font-extrabold flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
              tourMode === "tooth"
                ? "bg-brand-600 text-white shadow-lg"
                : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <span className="text-xs">🦷</span>
            3D Tooth Anatomy Explorer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full" id="three-clinic-tour-root">
        
        {/* Visualizer Canvas - 7 columns */}
        <div className="lg:col-span-7 flex flex-col bg-[#070b14] border border-brand-950/70 rounded-2xl overflow-hidden relative min-h-[440px]">
          
          {/* Header context tags */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-900/40 text-[10px] text-accent-400 font-mono flex items-center gap-2 pointer-events-auto shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
              {tourMode === "walkthrough" ? "ENVIRONMENT: CLINIC BLUEPRINT" : "ANATOMY SIMULATOR: 3D MOLAR TOOTH"}
            </div>

            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={() => rotateCamera("left")}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition"
                title="Look Left"
                id="btn-tour-nav-left"
              >
                <MoveLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => rotateCamera("right")}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition"
                title="Look Right"
                id="btn-tour-nav-right"
              >
                <MoveRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Render Minimap IF in Walkthrough view */}
          {tourMode === "walkthrough" && (
            <div className="absolute top-[75px] right-4 bg-slate-950/80 border border-brand-500/20 backdrop-blur-md p-2.5 rounded-2xl shadow-xl w-[120px] h-[140px] md:w-[130px] md:h-[150px] flex flex-col items-center justify-between select-none pointer-events-auto z-10 transition-all hover:border-accent-500/40" id="tour-minimap-container">
              <div className="text-[9px] text-accent-500 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <Map className="w-2.5 h-2.5 animate-pulse text-accent-400" />
                MINIMAP RADAR
              </div>
              
              <div className="relative w-18 h-18 md:w-20 md:h-20 bg-brand-950/20 rounded-full border border-brand-900/30 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <radialGradient id="minimapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                      <stop offset="90%" stopColor="#0f172a" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Concentric rings */}
                  <circle cx="50" cy="50" r="46" fill="url(#minimapGlow)" stroke="#1d4ed8" strokeWidth="0.75" strokeDasharray="1 3" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#8d2820" strokeWidth="0.5" strokeDasharray="1,2" />
                  <circle cx="50" cy="50" r="14" fill="none" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="1,2" />
                  
                  <line x1="50" y1="4" x2="50" y2="96" stroke="#0f172a" strokeWidth="0.5" />
                  <line x1="4" y1="50" x2="96" y2="50" stroke="#0f172a" strokeWidth="0.5" />

                  {/* Shading vision cone */}
                  <g ref={coneRef}>
                    <path 
                      d="M 50 50 L 32.5 15 A 35 35 0 0 1 67.5 15 Z" 
                      fill="rgba(34, 211, 238, 0.15)" 
                      stroke="rgba(34, 211, 238, 0.4)" 
                      strokeWidth="0.75" 
                    />
                    <line x1="50" y1="50" x2="50" y2="8" stroke="#eb9020" strokeWidth="1" strokeDasharray="2,2" />
                  </g>

                  <circle cx="50" cy="50" r="2.5" fill="#3b82f6" />

                  {/* Hotspots points */}
                  {CLINIC_HOTSPOTS.map((spot) => {
                    const coords = getSvgCoords(spot.position);
                    const isSelected = selectedHotspot?.id === spot.id;
                    
                    const lowerQuery = searchQuery.toLowerCase();
                    const matchedSearch = !searchQuery || 
                      spot.title.toLowerCase().includes(lowerQuery) ||
                      spot.description.toLowerCase().includes(lowerQuery);

                    return (
                      <g 
                        key={spot.id} 
                        onClick={() => selectHotspot(spot)} 
                        className={`cursor-pointer group ${matchedSearch ? "opacity-100" : "opacity-25"}`}
                      >
                        {isSelected && (
                          <>
                            <circle cx={coords.x} cy={coords.y} r="8" fill="none" stroke="#eb9020" strokeWidth="1" className="animate-spin" style={{ transformOrigin: `${coords.x}px ${coords.y}px`, animationDuration: '4s' }} />
                          </>
                        )}

                        <circle 
                          cx={coords.x} 
                          cy={coords.y} 
                          r={isSelected ? "4" : "2.5"} 
                          fill={isSelected ? "#eb9020" : "#8d2820"} 
                          className="transition-all duration-155"
                        />
                        <title>{spot.title}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="text-[8px] text-slate-400 text-center font-bold tracking-tight bg-slate-900/50 w-full py-0.5 rounded border border-brand-950/50 uppercase truncate max-w-full">
                {selectedHotspot?.id ? selectedHotspot.id.replace("-", " ") : "SELECT ZONE"}
              </div>
            </div>
          )}

          {/* Render Tooth Anatomy Core Overlay IF in Tooth Explorer mode */}
          {tourMode === "tooth" && (
            <div className="absolute top-[75px] right-4 bg-[#030712]/90 border border-emerald-500/20 backdrop-blur-md p-2.5 rounded-2xl shadow-xl w-[120px] h-[140px] md:w-[130px] md:h-[150px] flex flex-col items-center justify-between pointer-events-auto z-10 select-none">
              <div className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ANATOMY CORE
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1 my-1">
                <div className="text-xl">🦷</div>
                <div className="text-[10px] text-white font-sans uppercase font-extrabold tracking-tight mt-1 truncate max-w-[100px]">
                  {selectedToothLayer}
                </div>
                <div className="text-[8px] text-slate-400 font-mono">
                  SHELL: {Math.round(enamelOpacity * 100)}%
                </div>
              </div>

              <button
                onClick={() => {
                  setEnamelOpacity(enamelOpacity <= 0.2 ? 0.85 : 0.1);
                }}
                className="text-[8px] text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/85 border border-emerald-900/50 hover:border-emerald-500/40 w-full py-1 rounded-lg uppercase tracking-wider transition-all font-mono font-bold"
              >
                Toggle X-Ray
              </button>
            </div>
          )}

          {/* THREE.JS Canvas grab trigger container */}
          <div
            ref={containerRef}
            className="flex-1 relative cursor-grab active:cursor-grabbing h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Environmental instructional indicator */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 backdrop-blur-sm p-2 rounded-xl pointer-events-none text-[10px] text-slate-400 font-mono flex items-center gap-1.5 shadow-lg max-w-[280px] sm:max-w-none">
              <Eye className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
              <span>DRAG IN ANY DIRECTION TO SPIN {tourMode === "walkthrough" ? "CLINIC BLUEPRINT" : "ANATOMICAL TOOTH"}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Controls Panel - 5 columns */}
        {tourMode === "walkthrough" ? (
          
          /* WALKTHROUGH CONTROLS PANEL */
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-sans text-xs tracking-wider text-accent-500/80 font-bold uppercase">
                  Explore Spaces & Hotspots
                </h3>
                <span className="font-mono text-[9px] text-slate-500">
                  {filteredHotspots.length} spaces matched
                </span>
              </div>

              {/* Search areas */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-450 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search spaces (e.g. reception, sterilization, scanner...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070b14] border border-brand-950/60 hover:border-brand-900/40 focus:border-brand-500/50 text-[11px] text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-14 py-3 outline-none transition font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-2.5 text-[9px] text-slate-400 hover:text-slate-200 bg-slate-950/90 px-1.5 py-1 rounded border border-slate-800 transition uppercase font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Scrollable spaces list */}
              <div className="grid grid-cols-1 gap-2 max-h-[190px] overflow-y-auto pr-1">
                {filteredHotspots.length > 0 ? (
                  filteredHotspots.map((spot) => {
                    const isSelected = selectedHotspot?.id === spot.id;
                    const isReceptionZone = spot.id.startsWith("reception");
                    const isSterilizationZone = spot.id.startsWith("sterilization");
                    
                    return (
                      <button
                        key={spot.id}
                        onClick={() => selectHotspot(spot)}
                        className={`w-full text-left p-3 rounded-xl font-sans transition border flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-950/50 border-brand-500/40 text-white shadow-lg"
                            : "bg-[#090f1d] border-brand-950/50 text-slate-400 hover:text-slate-200 hover:bg-[#0f192f]"
                        }`}
                        id={`btn-hotspot-${spot.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            isSelected ? "bg-accent-400 animate-pulse" : 
                            isReceptionZone ? "bg-emerald-500" :
                            isSterilizationZone ? "bg-amber-500" : "bg-slate-700"
                          }`} />
                          <div className="truncate max-w-[190px] md:max-w-[260px]">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider">{spot.title}</h4>
                            <p className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{spot.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-7 rounded-xl border border-dashed border-brand-950/50 bg-[#090f1d]/40 flex flex-col items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-slate-600" />
                    <p className="text-xs text-slate-500 font-sans">No clinic spaces matched.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Space Highlight details card */}
            {selectedHotspot && (
              <div className="p-4 bg-gradient-to-br from-[#0c1223] to-[#080d19] border border-brand-950/80 rounded-2xl shadow-xl flex flex-col justify-between flex-1 mt-1">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-accent-500 uppercase tracking-widest bg-brand-950/80 p-1 px-2.5 rounded-md border border-brand-800/25">
                      {selectedHotspot.id.startsWith("reception") ? "Eco-Lounge Zone" : 
                       selectedHotspot.id.startsWith("sterilization") ? "Class-B Sterilization Hub" : "Active Treatment Suite"}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-accent-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-[#f1f5f9] text-xs uppercase tracking-wide">
                      {selectedHotspot.title}
                    </h4>
                    <p className="font-sans text-[11px] text-slate-400 leading-relaxed mt-1.5">
                      {selectedHotspot.description}
                    </p>
                    <p className="font-sans text-[11px] text-brand-200/80 italic leading-relaxed mt-2.5 pt-2 border-t border-brand-950/70">
                      {selectedHotspot.details}
                    </p>
                  </div>
                </div>

                {/* Relational shortcut triggers */}
                {(selectedHotspot.linkedServiceId || selectedHotspot.linkedDoctorId) && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    {selectedHotspot.linkedServiceId && (
                      <button
                        onClick={() => onLinkToService(selectedHotspot.linkedServiceId!)}
                        className="flex-1 p-2 bg-brand-600 hover:bg-brand-500 text-white font-sans text-[10px] font-extrabold rounded-xl text-center transition flex items-center justify-center gap-1 uppercase tracking-wider shadow-md"
                      >
                        Procedure Details
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    {selectedHotspot.linkedDoctorId && (
                      <button
                        onClick={() => onLinkToDoctor(selectedHotspot.linkedDoctorId!)}
                        className="flex-1 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-sans text-[10px] font-extrabold rounded-xl text-center transition flex items-center justify-center gap-1 uppercase tracking-wider"
                      >
                        Clinician bio
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          
          /* TOOTH ANATOMY CONTROLS PANEL */
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-sans text-xs tracking-wider text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <span>🦷</span>
                  Tooth Anatomy Layers
                </h3>
                <span className="font-mono text-[9px] text-slate-500">
                  Click a layer index to examine
                </span>
              </div>

              {/* Cross section range slider */}
              <div className="bg-[#070b14]/90 border border-brand-950/60 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-sans">
                  <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Enamel Translucency X-Ray
                  </span>
                  <span className="font-mono text-emerald-400 font-extrabold">{Math.round(enamelOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={enamelOpacity}
                  onChange={(e) => setEnamelOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[8px] text-slate-500 font-mono uppercase">
                  <span>See-Through (Internal)</span>
                  <span>Opaque Shell</span>
                </div>
              </div>

              {/* Mapped anatomical layers buttons list */}
              <div className="grid grid-cols-1 gap-1.5 max-h-[190px] overflow-y-auto pr-1">
                {TOOTH_LAYERS.map((lvl) => {
                  const isSelected = selectedToothLayer === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedToothLayer(lvl.id)}
                      className={`w-full text-left p-3 rounded-xl font-sans transition border flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-950/30 border-emerald-500/30 text-white shadow-lg"
                          : "bg-[#090f1d] border-brand-950/50 text-slate-400 hover:text-slate-200 hover:bg-[#0f192f]"
                      }`}
                      id={`btn-tooth-layer-${lvl.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-white/10"
                          style={{
                            backgroundColor: 
                              lvl.id === "enamel" ? "#f8fafc" :
                              lvl.id === "dentin" ? "#ea580c" :
                              lvl.id === "pulp" ? "#ef4444" :
                              lvl.id === "roots" ? "#94a3b8" : "#fda4af"
                          }}
                        />
                        <div className="truncate max-w-[190px] md:max-w-[260px]">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider">{lvl.title}</h4>
                          <p className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{lvl.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected core layer diagnostic summary */}
            {activeLayerMeta && (
              <div className="p-4 bg-gradient-to-br from-[#0c1223] to-[#080d19] border border-brand-950/80 rounded-2xl shadow-xl flex flex-col justify-between flex-1 mt-1 animate-fade-in">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#10b981] uppercase tracking-widest bg-emerald-950/60 p-1 px-2.5 rounded-md border border-emerald-900/40">
                      Biomimetic Anatomy Core
                    </span>
                    <Info className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-[#f1f5f9] text-xs uppercase tracking-wide">
                      {activeLayerMeta.title}
                    </h4>
                    <p className="font-sans text-[11px] text-slate-400 leading-relaxed mt-1.5">
                      {activeLayerMeta.description}
                    </p>
                    <p className="font-sans text-[11px] text-emerald-250/80 italic leading-relaxed mt-2.5 pt-2 border-t border-[#065f46]/35 text-[#a7f3d0]">
                      {activeLayerMeta.details}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
