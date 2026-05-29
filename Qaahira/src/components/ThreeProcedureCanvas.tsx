import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, RotateCcw, ZoomIn, ZoomOut, Compass, Info, CheckCircle2 } from "lucide-react";

interface ThreeProcedureCanvasProps {
  modelType: string; // 'implant' | 'root_canal' | 'aligner' | 'veneer' | 'crown_bridge'
  activeStep: number; // 0, 1, 2, 3 depending on procedure
}

const STEP_DESCRIPTIONS: { [key: string]: { title: string; desc: string }[] } = {
  implant: [
    { title: "Jawbone Preparation & Diagnostics", desc: "A micro-incision is placed in the gum tissue, and high-precision pilot holes are created in the underlying jawbone under constant cooling to prevent bone cell shock." },
    { title: "Titanium Post Insertion", desc: "A sterile, medical-grade solid titanium screw is embedded directly into the bone. Titanium is bio-compatible and can fuse directly to living bone (osseointegration)." },
    { title: "Abutment Attachment", desc: "After the post stabilizes and integrates into the jaw (typically 2-4 months), a small collar connector called an abutment is tightly screwed into the top of the titanium post." },
    { title: "Crown Restoration Integration", desc: "A bespoke porcelain-ceramic crown is permanently cemented or screwed onto the clinical abutment, fully restoring dentition symmetry and 100% bite-strength." }
  ],
  root_canal: [
    { title: "Coronal Access Point Opening", desc: "A tiny opening is created through the top enamel crown of the infected tooth under local anesthesia, providing clean access to the damaged dental pulp." },
    { title: "Pulp Removal & Sterilization", desc: "The diseased nerve fibers and infected cellular pulp within the root canals are meticulously extracted using computerized micro-files, and sterilizing wash is applied." },
    { title: "Canal Shaping & Biocompatible Sealing", desc: "The empty, sterilized root canals are shaped and packed with a natural thermal rubber-like sealer called gutta-percha, preventing any bacterial re-entry." },
    { title: "Core Reinforcement & Crown Finish", desc: "A reinforcing glass-fiber support post is fitted down the root canal to secure the core, and a protective porcelain crown is fitted to safeguard the tooth." }
  ],
  aligner: [
    { title: "Digital Orthodontic Planning", desc: "A high-resolution CBCT laser scanner registers every angle of your present dental alignment, generating an advanced progression map of tooth shift vectors." },
    { title: "Smart Force Attachment Installation", desc: "Ultra-subtle, tooth-colored composite attachment nodes are cured to specific teeth, giving the progressive trays additional mechanical surface leverage." },
    { title: "Progressive Aligner Sequence Wear", desc: "A customized medical-grade transparent polyurethane tray is worn. This tray applies low-intensity, persistent tension to shift teeth steadily." },
    { title: "Retention and Smile Settle", desc: "After the tooth coordinates settle into perfect symmetry, a invisible retainer is worn at night to prevent bone elasticity from causing alignment regression." }
  ],
  veneer: [
    { title: "Micro-Enamel Preparation", desc: "A minute layer of surface enamel (approximately 0.3mm to 0.5mm) is gently refined from the front of the tooth. This ensures the finalized thin veneer sits flush." },
    { title: "Digital Color Mapping & Impression", desc: "A high-precision optical impression is completed, and we choose the perfect natural matching enamel shade from our bio-ceramic spectrum." },
    { title: "Bespoke Ceramic Fabrication", desc: "Computerized CAD/CAM milling routers craft a customized, translucent porcelain casing designed to mimic natural light reflection characteristics." },
    { title: "Chemical Luting & Curing", desc: "The tooth is etched, a special adhesive bonding polymer is applied, the veneer is positioned, and a high-wavelength UV light cured the bond permanently." }
  ]
};

export default function ThreeProcedureCanvas({ modelType, activeStep }: ThreeProcedureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Three.js instance references
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Group objects we need to animate relative to steps
  const groupRef = useRef<THREE.Group | null>(null);
  const teethGroupRef = useRef<THREE.Group | null>(null);
  
  const titaniumPostRef = useRef<THREE.Mesh | null>(null);
  const abutmentRef = useRef<THREE.Mesh | null>(null);
  const crownRef = useRef<THREE.Mesh | null>(null);
  const pulpNervesRef = useRef<THREE.LineSegments | null>(null);
  const rootFillerRef = useRef<THREE.Mesh | null>(null);
  const alignerShellRef = useRef<THREE.Mesh | null>(null);
  const veneerPlateRef = useRef<THREE.Mesh | null>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const steps = STEP_DESCRIPTIONS[modelType] || STEP_DESCRIPTIONS["implant"];

  // Handle standard viewport controls
  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current) return;
    const factor = direction === "in" ? 0.8 : 1.25;
    cameraRef.current.position.multiplyScalar(factor);
    setZoomLevel(prev => prev * (direction === "in" ? 1.2 : 0.8));
  };

  const handleResetControls = () => {
    if (!cameraRef.current || !groupRef.current) return;
    cameraRef.current.position.set(0, 4, 10);
    cameraRef.current.lookAt(0, 0, 0);
    groupRef.current.rotation.set(0, 0, 0);
    setZoomLevel(1);
  };

  // Drag to rotate manually
  const isDragging = useRef(false);
  const prevMousePosition = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !groupRef.current) return;
    const deltaX = e.clientX - prevMousePosition.current.x;
    const deltaY = e.clientY - prevMousePosition.current.y;

    groupRef.current.rotation.y += deltaX * 0.01;
    groupRef.current.rotation.x += deltaY * 0.01;

    prevMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1329"); // Deep midnight dental clinic background
    sceneRef.current = scene;

    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 3, 9);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // AMBIENT, DIRECTIONAL AND SPOT LIGHTING (Clinic feeling)
    const ambientLight = new THREE.AmbientLight("#40507a", 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight("#e0f2fe", 2.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const spotLight = new THREE.SpotLight("#38bdf8", 4, 15, Math.PI / 6, 0.5, 1);
    spotLight.position.set(-5, 8, -2);
    scene.add(spotLight);

    // ROOT ASSEMBLY GROUP
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);
    groupRef.current = assemblyGroup;

    // PROCEDURAL MODEL GENERATION

    // A. Healthy Pink Gums (Custom Curved Shape or torus segment)
    const gumGeometry = new THREE.BoxGeometry(7, 1.2, 2.5, 30, 2, 2);
    // Displace vertices slightly to make a natural curved dental gum arch
    const pos = gumGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Curve gum arch backwards at the sides
      pos.setZ(i, z - (x * x) * 0.12);
    }
    gumGeometry.computeVertexNormals();

    const gumMaterial = new THREE.MeshStandardMaterial({
      color: "#ff708a", // healthy tissue coral pink
      roughness: 0.15,
      metalness: 0.05,
      flatShading: false
    });
    const gums = new THREE.Mesh(gumGeometry, gumMaterial);
    gums.position.y = -1.2;
    gums.receiveShadow = true;
    assemblyGroup.add(gums);

    // B. Teeth Arch Group
    const teethGroup = new THREE.Group();
    assemblyGroup.add(teethGroup);
    teethGroupRef.current = teethGroup;

    // Render 5 adjacent teeth (except for missing center tooth in implants)
    const teethXPositions = [-2.4, -1.2, 0, 1.2, 2.4];
    const toothMaterial = new THREE.MeshStandardMaterial({
      color: "#f8fafc", // clinical glossy enamel
      roughness: 0.2,
      metalness: 0.0
    });

    const rootCanalToothMaterial = new THREE.MeshStandardMaterial({
      color: "#f1f5f9",
      roughness: 0.3,
      transparent: true,
      opacity: 0.70 // translucent so pulp/fillers are visible inside!
    });

    teethXPositions.forEach((xPos) => {
      // If it is dental implant model and center position, keep empty (place holder for titanium post)
      if (modelType === "implant" && xPos === 0) return;

      let toothGeom;
      let toothMat = toothMaterial;

      if (modelType === "root_canal" && xPos === 0) {
        // Center tooth is translucent to show root canal steps
        toothGeom = new THREE.CylinderGeometry(0.5, 0.4, 1.5, 8);
        toothMat = rootCanalToothMaterial;
      } else if (modelType === "veneer" && xPos === 0) {
        // Center tooth starts yellowed/stained in veneer model
        toothGeom = new THREE.BoxGeometry(0.8, 1.2, 0.8);
        toothMat = new THREE.MeshStandardMaterial({
          color: "#eab308", // stained/damaged yellow
          roughness: 0.4
        });
      } else if (modelType === "aligner") {
        // Standard shape teeth
        toothGeom = new THREE.BoxGeometry(0.8, 1.1, 0.8);
      } else {
        // Standard molar cylinder
        toothGeom = new THREE.CylinderGeometry(0.5, 0.45, 1.2, 8);
      }

      const toothMesh = new THREE.Mesh(toothGeom, toothMat);
      toothMesh.position.set(xPos, -0.4, - (xPos * xPos) * 0.12);
      toothMesh.castShadow = true;
      teethGroup.add(toothMesh);
    });

    // C. STEP SPECIFIC PROCEDURAL ADDITIONS

    // 1. DENTAL IMPLANT SPECIFIC MODELS (Central Tooth Missing)
    if (modelType === "implant") {
      // Standard Threaded Titanium Post Screw
      const postGeom = new THREE.CylinderGeometry(0.3, 0.2, 1.3, 16);
      const titaniumMat = new THREE.MeshStandardMaterial({
        color: "#64748b", // titanium slate blue steel
        metalness: 0.9,
        roughness: 0.15
      });
      const postMesh = new THREE.Mesh(postGeom, titaniumMat);
      // Place deep in gum line
      postMesh.position.set(0, -1.5, 0); 
      postMesh.castShadow = true;
      assemblyGroup.add(postMesh);
      titaniumPostRef.current = postMesh;

      // Abutment (Heptagonal Gold/Titanium connector crown piece)
      const abutmentGeom = new THREE.CylinderGeometry(0.35, 0.3, 0.6, 6);
      const goldMat = new THREE.MeshStandardMaterial({
        color: "#cbd5e1", // silver steel abutment
        metalness: 0.85,
        roughness: 0.1
      });
      const abutmentMesh = new THREE.Mesh(abutmentGeom, goldMat);
      // Sits on top of the screw
      abutmentMesh.position.set(0, -0.85, 0);
      abutmentMesh.castShadow = true;
      assemblyGroup.add(abutmentMesh);
      abutmentRef.current = abutmentMesh;

      // Implant Porcelain Crown restore
      const crownGeom = new THREE.CylinderGeometry(0.5, 0.45, 1.2, 8);
      const crownMat = new THREE.MeshStandardMaterial({
        color: "#ffffff", // Pure matching porcelain white
        roughness: 0.05,
        metalness: 0.0
      });
      const crownMesh = new THREE.Mesh(crownGeom, crownMat);
      crownMesh.position.set(0, 0.0, 0);
      crownMesh.castShadow = true;
      assemblyGroup.add(crownMesh);
      crownRef.current = crownMesh;
    }

    // 2. ROOT CANAL SPECIFIC MODELS (Visible inside central translucent tooth)
    if (modelType === "root_canal") {
      // Infected Pulp Threads (Represented as red glowing nerve lines)
      const points = [];
      points.push(new THREE.Vector3(0, 0.3, 0));
      points.push(new THREE.Vector3(0.15, -0.2, 0.05));
      points.push(new THREE.Vector3(-0.15, -0.2, -0.05));
      points.push(new THREE.Vector3(0.1, -0.6, 0.1));
      points.push(new THREE.Vector3(-0.1, -0.6, -0.1));

      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const redNerveMat = new THREE.LineBasicMaterial({
        color: "#ef4444", // glowing infected red
        linewidth: 3
      });
      const nerves = new THREE.LineSegments(lineGeom, redNerveMat);
      nerves.position.set(0, -0.4, 0);
      assemblyGroup.add(nerves);
      pulpNervesRef.current = nerves;

      // Restored canals (gutta percha sealant rod insert)
      const guttaGeom = new THREE.CylinderGeometry(0.1, 0.05, 1.0, 8);
      const orangeMat = new THREE.MeshStandardMaterial({
        color: "#f97316", // therapeutic medical gutta-percha orange
        roughness: 0.3,
        emissive: "#f97316",
        emissiveIntensity: 0.4
      });
      const guttaMesh = new THREE.Mesh(guttaGeom, orangeMat);
      guttaMesh.position.set(0, -0.5, 0);
      guttaMesh.castShadow = true;
      assemblyGroup.add(guttaMesh);
      rootFillerRef.current = guttaMesh;

      // Crown cover cap
      const protectiveCapGeom = new THREE.CylinderGeometry(0.52, 0.52, 0.4, 8);
      const protectiveCapMesh = new THREE.Mesh(protectiveCapGeom, toothMaterial);
      protectiveCapMesh.position.set(0, 0.4, 0);
      protectiveCapMesh.castShadow = true;
      assemblyGroup.add(protectiveCapMesh);
      crownRef.current = protectiveCapMesh;
    }

    // 3. CLEAR ALIGNERS MODELS
    if (modelType === "aligner") {
      // Semi-transparent glassy sleeve that wraps all teeth!
      const alignerGeom = new THREE.BoxGeometry(6.4, 1.4, 1.6);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: "#38bdf8",
        transparent: true,
        opacity: 0.35,
        transmission: 0.9,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5
      });
      const alignerShell = new THREE.Mesh(alignerGeom, glassMat);
      alignerShell.position.set(0, -0.3, 0);
      assemblyGroup.add(alignerShell);
      alignerShellRef.current = alignerShell;
    }

    // 4. PORCELAIN VENEERS MODELS
    if (modelType === "veneer") {
      // Custom slim facade box representing the veneer plate
      const veneerGeom = new THREE.BoxGeometry(0.9, 1.25, 0.15);
      const veneerMat = new THREE.MeshStandardMaterial({
        color: "#ffffff", // Pure high-gloss snow white shade
        roughness: 0.02,
        metalness: 0.0,
        emissive: "#ffffff",
        emissiveIntensity: 0.12
      });
      const veneerPlate = new THREE.Mesh(veneerGeom, veneerMat);
      // Sits directly on the face of the stained tooth
      veneerPlate.position.set(0, -0.38, 0.45);
      veneerPlate.castShadow = true;
      assemblyGroup.add(veneerPlate);
      veneerPlateRef.current = veneerPlate;
    }

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Micro-fluctuations or idle rotations
      if (isRotating && !isDragging.current) {
        assemblyGroup.rotation.y += 0.005;
      }

      // RENDER
      renderer.render(scene, camera);
    };

    animate();

    // WINDOW RESIZE OBSERVING
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

    // CLEANUP CLEANING FUNCTION
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [modelType, isRotating]);

  // UPDATE SCENE BASED ON THE CURRENT ACTIVE PROCEDURAL STEP
  useEffect(() => {
    // 1. Dental implant animation step triggers
    if (modelType === "implant") {
      if (titaniumPostRef.current && abutmentRef.current && crownRef.current) {
        if (activeStep === 0) {
          // Prepping - Hide post, abutment, crown in jaw
          titaniumPostRef.current.visible = false;
          abutmentRef.current.visible = false;
          crownRef.current.visible = false;
        } else if (activeStep === 1) {
          // Post placed - Post visible and glowing, abutment & crown hidden
          titaniumPostRef.current.visible = true;
          titaniumPostRef.current.position.y = -1.2; // deep
          abutmentRef.current.visible = false;
          crownRef.current.visible = false;
        } else if (activeStep === 2) {
          // Abutment placed - Post and abutment visible, crown hidden
          titaniumPostRef.current.visible = true;
          titaniumPostRef.current.position.y = -1.3;
          abutmentRef.current.visible = true;
          abutmentRef.current.position.y = -0.7;
          crownRef.current.visible = false;
        } else if (activeStep === 3) {
          // Restoration complete - Everything fully constructed and visible
          titaniumPostRef.current.visible = true;
          titaniumPostRef.current.position.y = -1.3;
          abutmentRef.current.visible = true;
          abutmentRef.current.position.y = -0.7;
          crownRef.current.visible = true;
          crownRef.current.position.y = 0.2; // sits high and tall
        }
      }
    }

    // 2. Root Canal animation step triggers
    if (modelType === "root_canal") {
      if (pulpNervesRef.current && rootFillerRef.current && crownRef.current) {
        if (activeStep === 0) {
          // Infected crown - Red pulp visible, sealer and restoration hidden
          pulpNervesRef.current.visible = true;
          rootFillerRef.current.visible = false;
          crownRef.current.visible = false;
        } else if (activeStep === 1) {
          // Cleaning - Nerves scale smaller (getting sucked out), sealer and restoration hidden
          pulpNervesRef.current.visible = true;
          pulpNervesRef.current.scale.set(0.3, 0.3, 0.3);
          rootFillerRef.current.visible = false;
          crownRef.current.visible = false;
        } else if (activeStep === 2) {
          // Filling - Nerves fully removed, biocompatible sealer core glowing and visible
          pulpNervesRef.current.visible = false;
          rootFillerRef.current.visible = true;
          rootFillerRef.current.scale.set(1, 1, 1);
          crownRef.current.visible = false;
        } else if (activeStep === 3) {
          // Capped - Crown reinforced and fully covered
          pulpNervesRef.current.visible = false;
          rootFillerRef.current.visible = true;
          crownRef.current.visible = true;
        }
      }
    }

    // 3. Clear Aligners animation step triggers
    if (modelType === "aligner") {
      if (alignerShellRef.current && teethGroupRef.current) {
        if (activeStep === 0) {
          // Planning - Aligner invisible, teeth slightly crooked/misaligned
          alignerShellRef.current.visible = false;
          // Twist some teeth inside the groups
          teethGroupRef.current.children.forEach((mesh, index) => {
            if (index === 1) mesh.rotation.y = 0.3;
            if (index === 3) mesh.rotation.y = -0.25;
          });
        } else if (activeStep === 1) {
          // Nodes placed - Aligner visible but high up (off), teeth still crooked
          alignerShellRef.current.visible = true;
          alignerShellRef.current.position.y = 1.0;
        } else if (activeStep === 2) {
          // Aligning wear - Aligner fits flush on top of teeth, teeth rotate back to perfect alignment
          alignerShellRef.current.visible = true;
          alignerShellRef.current.position.y = -0.3;
          teethGroupRef.current.children.forEach((mesh) => {
            mesh.rotation.y = 0; // perfectly straight
          });
        } else if (activeStep === 3) {
          // Retainer - Aligner becomes highly transparent (invisible retainer) and perfectly straight
          alignerShellRef.current.visible = true;
          alignerShellRef.current.position.y = -0.3;
          if (alignerShellRef.current.material) {
            (alignerShellRef.current.material as any).opacity = 0.15;
          }
        }
      }
    }

    // 4. Porcelain veneers cosmetic animation step triggers
    if (modelType === "veneer") {
      if (veneerPlateRef.current && teethGroupRef.current) {
        if (activeStep === 0) {
          // Stain visible, veneer plate offset/hidden
          veneerPlateRef.current.visible = false;
        } else if (activeStep === 1) {
          // Prepping - yellowed tooth shaved slightly (scald smaller in depth)
          veneerPlateRef.current.visible = false;
          const yellowTooth = teethGroupRef.current.children[2]; // the center yellowed tooth
          if (yellowTooth) {
            yellowTooth.scale.set(0.9, 1.0, 0.7); // flattened thickness
          }
        } else if (activeStep === 2) {
          // Fabricating - veneer plate visible but floating forward in space (curing preview)
          veneerPlateRef.current.visible = true;
          veneerPlateRef.current.position.set(0, -0.38, 1.0); // hovering ahead
        } else if (activeStep === 3) {
          // Bonded finished - veneer fits tight on the tooth face, covering stain completely with snow white beauty!
          veneerPlateRef.current.visible = true;
          veneerPlateRef.current.position.set(0, -0.38, 0.44); // flush
        }
      }
    }
  }, [activeStep, modelType]);

  return (
    <div className="flex flex-col h-full bg-[#080d1a] border border-brand-900/30 rounded-2xl overflow-hidden shadow-2xl shadow-brand-950/20">
      
      {/* 3D Canvas Header Controls */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d162d] border-b border-brand-950/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-500 animate-pulse" />
          <span className="font-sans text-xs tracking-wider text-accent-400 font-semibold uppercase">
            Interactive 3D Stage Simulator (WebGL)
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRotating(prev => !prev)}
            className={`p-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1 transition ${
              isRotating ? "bg-brand-950 text-accent-400 border border-brand-800/40" : "bg-slate-900 text-slate-400"
            }`}
            title="Toggle Autopilot Orbit Rotation"
            id="btn-3d-rotate-toggle"
          >
            <Compass className={`w-3.5 h-3.5 ${isRotating ? "animate-spin-slow" : ""}`} />
            {isRotating ? "AUTOPILOT" : "MANUAL"}
          </button>

          <div className="h-4 w-px bg-brand-900/40" />

          <button
            onClick={() => handleZoom("in")}
            className="p-1 px-2 rounded bg-slate-950 border border-slate-8 w-7 hover:bg-slate-900 text-slate-200"
            title="Zoom In"
            id="btn-3d-zoom-in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="p-1 px-2 rounded bg-slate-950 border border-slate-8 w-7 hover:bg-slate-900 text-slate-200"
            title="Zoom Out"
            id="btn-3d-zoom-out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetControls}
            className="p-1 px-2 rounded bg-slate-950 border border-slate-8 hover:bg-slate-900 text-slate-200 text-xs flex items-center gap-1 font-mono"
            title="Reset Angle"
            id="btn-3d-reset"
          >
            <RotateCcw className="w-3 h-3" />
            RESET
          </button>
        </div>
      </div>

      {/* The WebGL Canvas Area */}
      <div 
        ref={containerRef} 
        className="flex-1 relative cursor-grab active:cursor-grabbing min-h-[300px]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Helper overlay instructions */}
        <div className="absolute bottom-3 left-4 bg-slate-950/80 backdrop-blur-sm p-2 rounded-lg border border-slate-800 pointer-events-none text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <Info className="w-3 h-3 text-accent-500" />
          DRAG MOUSE OR USE ACCENTS TO INSPECT THE ANATOMY
        </div>

        {/* Current phase step visual marker */}
        <div className="absolute top-4 right-4 bg-brand-950/70 border border-brand-900/50 backdrop-blur-md px-3 py-1.5 rounded-xl font-mono text-xs text-accent-400">
          STAGE {activeStep + 1} OF 4
        </div>
      </div>

      {/* Dynamic Clinical Step Explanation Card */}
      <div className="p-5 bg-[#0b1224] border-t border-brand-950/70 flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-sans font-medium text-sm text-slate-100 tracking-tight leading-tight">
              {steps[activeStep]?.title}
            </h4>
            <p className="font-sans text-xs text-slate-400 leading-relaxed mt-1">
              {steps[activeStep]?.desc}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
