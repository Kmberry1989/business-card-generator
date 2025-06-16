import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Aperture, Palette, Type, Info, Send, Download, RotateCcw, Image as ImageIcon, Link as LinkIcon, Phone, Mail, QrCode, Building, Briefcase, Sparkles, Save, Trash2, List, AlignLeft, AlignCenter, AlignRight, PhoneCall, Smartphone, AtSign, Inbox, Globe, Network, ChevronLeft, ChevronRight, Bold, Italic, Underline, Voicemail, Mailbox, MousePointerClick, AlignHorizontalJustifyStart, UserCircle2, TextCursorInput } from 'lucide-react'; // Removed Bot icon as it was for AI features

// --- Constants and Configuration ---
const CARD_ASPECT_RATIO = 85.6 / 53.98;
const CARD_PREVIEW_WIDTH_PX = 350;

// Updated createTextObject to include fontSize
const createTextObject = (text = '', bold = false, italic = false, underline = false, fontSize = 14) => ({ text, bold, italic, underline, fontSize });

const initialCardData = {
  name: createTextObject('Your Name', true, false, false, 24), // Default name font size
  title: createTextObject('Your Title', false, true, false, 16), // Default title font size
  company: createTextObject('Your Company', false, false, false, 14), // Default company font size
  phone: createTextObject('555-123-4567', false, false, false, 12), // Default phone font size
  email: createTextObject('your.email@example.com', false, false, false, 12), // Default email font size
  website: createTextObject('www.yourwebsite.com', false, false, false, 12), // Default website font size
  tagline: createTextObject('Your catchy tagline here!', false, true, false, 10), // Default tagline font size
  logoUrl: '',
  headshotUrl: '',
  customFields: [],
};

const defaultElementPositions = {
    name: { x: 50, y: 15 },
    title: { x: 50, y: 28 },
    company: { x: 50, y: 48 }, // Increased default spacing for company (+7 from original)
    phone: { x: 50, y: 61 }, // Shifted down by +7
    email: { x: 50, y: 74 }, // Shifted down by +7
    website: { x: 50, y: 87 }, // Shifted down by +7
    tagline: { x: 50, y: 100 }, // Shifted down by +7
    monogram: { x: 50, y: 50 },
    qrcode: { x: 85, y: 85 },
    logo: { x: 15, y: 15 },
    headshot: { x: 85, y: 20 },
};

const initialCardStyle = {
  fontFamily: "'Inter', sans-serif",
  cardBackgroundColor: "#FFFFFF",
  textColor: "#333333",
  primaryColor: "#007BFF",
  secondaryColor: "#6C757D",
  frontElements: ["name", "title", "company", "phone", "email", "website", "logo", "headshot"],
  backElements: ["monogram", "website"],
  cornerRadius: "lg",
  cardBorderWidth: "0px",
  cardBorderStyle: "solid",
  cardBorderColor: "#000000",
  elementPositions: defaultElementPositions,
  phoneIcon: 0, emailIcon: 0, websiteIcon: 0,
  qrCode: { enabled: false, side: 'back', position: 'bottom-right', size: 48 },
  headshot: { shape: 'circle', size: 60 },
  decorations: [],
  lineSpacing: 1.5,
  finish: 'smooth',
};

const iconOptions = {
    phone: [<Phone size={14} />, <PhoneCall size={14} />, <Smartphone size={14} />, <Voicemail size={14} />, 'None'],
    email: [<Mail size={14} />, <AtSign size={14} />, <Inbox size={14} />, <Mailbox size={14} />, 'None'],
    website: [<LinkIcon size={14} />, <Globe size={14} />, <Network size={14} />, <MousePointerClick size={14} />, 'None'],
};

const defaultPresets = {
    "Rochelle Elaine Berry": {
        cardData: {
            name: createTextObject('Rochelle Elaine Berry', true, false, false, 30),
            title: createTextObject('Creative Strategist & Digital Storyteller', false, true, false, 18),
            company: createTextObject('Your Agency Co.', false, false, false, 14),
            phone: createTextObject('574.601.5652', false, false, false, 12), email: createTextObject('rochelleberry731@gmail.com', false, false, false, 12), website: createTextObject('www.rochelleberry.com', false, false, false, 12), tagline: createTextObject('Creativity in motion.', false, true, false, 10), logoUrl: '', headshotUrl: ''
        },
        cardStyle: {
          ...initialCardStyle,
          fontFamily: "'Playfair Display', serif",
          primaryColor: "#db2777",
          secondaryColor: "#52525b",
          qrCode: { enabled: false, side: 'back', position: 'bottom-right', size: 80 },
          frontElements: ["name", "title", "phone", "email", "website"],
          backElements: ["monogram", "company", "website", "tagline"],
            elementPositions: {
                name: { x: 5, y: 30 },
                title: { x: 5, y: 42 },
                company: { x: 5, y: 62 }, // Increased spacing for company here too (+8 from original preset value)
                phone: { x: 5, y: 74 }, // Shifted down by +8
                email: { x: 5, y: 86 }, // Shifted down by +8
                website: { x: 5, y: 98 }, // Shifted down by +8
                monogram: {x: 50, y: 50},
                qrcode: { x: 85, y: 85 },
                logo: { x: 15, y: 15 },
                headshot: { x: 85, y: 20 },
            }
        },
        // Removed stylePrompt from here
    }
};

// Removed initialStylePrompt

const styleTemplates = {
    "Minimalist": {
        fontFamily: "'Inter', sans-serif",
        cardBackgroundColor: "#FFFFFF",
        textColor: "#333333",
        primaryColor: "#007BFF",
        secondaryColor: "#6C757D",
        frontElements: ["name", "title", "phone", "email"],
        backElements: ["company", "website", "tagline"],
        cornerRadius: "md",
        cardBorderWidth: "0px",
        cardBorderStyle: "solid",
        cardBorderColor: "#000000",
        lineSpacing: 1.5,
        finish: 'smooth',
        // Removed stylePrompt from here
    },
    "Bold & Modern": {
        fontFamily: "'Oswald', sans-serif",
        cardBackgroundColor: "#2C3E50", // Dark blue-grey
        textColor: "#ECF0F1", // Light grey
        primaryColor: "#E74C3C", // Red
        secondaryColor: "#95A5A6", // Desaturated blue
        frontElements: ["name", "title", "company"],
        backElements: ["phone", "email", "website", "tagline", "qrcode"],
        cornerRadius: "lg",
        cardBorderWidth: "2px",
        cardBorderStyle: "solid",
        cardBorderColor: "#E74C3C",
        lineSpacing: 1.2,
        finish: 'matte',
        qrCode: { enabled: true, side: 'back', position: 'bottom-right', size: 48 },
        // Removed stylePrompt from here
    },
    "Elegant Script": {
        fontFamily: "'Dancing Script', cursive",
        cardBackgroundColor: "#FDF5E6", // Off-white/cream
        textColor: "#5A4C40", // Dark brown
        primaryColor: "#8B4513", // Saddle brown
        secondaryColor: "#A0522D", // Sienna
        frontElements: ["name", "title", "email"],
        backElements: ["company", "phone", "website", "monogram"],
        cornerRadius: "full", // Pill shape
        cardBorderWidth: "1px",
        cardBorderStyle: "dashed",
        cardBorderColor: "#8B4513",
        lineSpacing: 1.8,
        finish: 'linen',
        // Removed stylePrompt from here
    },
    "Corporate Professional": { // New style template
        fontFamily: "'Roboto', sans-serif",
        cardBackgroundColor: "#F0F4F8", // Light blue-grey
        textColor: "#2C3E50", // Dark blue-grey
        primaryColor: "#3498DB", // Professional blue
        secondaryColor: "#7F8C8D", // Neutral grey
        frontElements: ["name", "title", "company", "phone", "email"],
        backElements: ["website", "qrcode", "logo"], // Example: logo on back too
        cornerRadius: "md",
        cardBorderWidth: "1px",
        cardBorderStyle: "solid",
        cardBorderColor: "#BDC3C7",
        lineSpacing: 1.4,
        finish: 'smooth',
        qrCode: { enabled: true, side: 'back', position: 'bottom-right', size: 48 },
        // Removed stylePrompt from here
    }
};

const FONT_SIZES = Array.from({ length: 33 }, (_, i) => i + 8); // Font sizes from 8px to 40px

// --- Helper & Utility Functions ---
const isValidHttpUrl = (string) => { if (!string) return false; let url; try { url = new URL(string.startsWith('http') ? string : `https://${string}`); } catch (_) { return false; } return url.protocol === "http:" || url.protocol === "https:"; };
const generateMonogram = (nameObj) => { const name = nameObj?.text || ''; if (!name) return ""; const parts = name.trim().split(/\s+/); if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(); if (parts.length === 1 && parts[0].length > 1) return (parts[0][0] + parts[0][1]).toUpperCase(); if (parts.length === 1) return parts[0][0].toUpperCase(); return ""; };
const hexToRgba = (hex) => { if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return { r: 0, g: 0, b: 0, a: 1 }; let c = hex.substring(1).split(''); if(c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]]; if(c.length !== 6) return { r: 0, g: 0, b: 0, a: 1 }; c = '0x'+c.join(''); return { r: (c>>16)&255, g: (c>>8)&255, b: c&255, a: 1 }; };
const rgbaToHex = (r, g, b) => '#' + [r, g, b].map(x => Math.round(x)).map(x => x.toString(16).padStart(2, '0')).join('');
const rgbaToHsva = (rgba) => { if (!rgba) return { h: 0, s: 0, v: 0, a: 1 }; const {r,g,b,a} = rgba; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s, v = max / 255; const d = max - min; s = max === 0 ? 0 : d / max; if (max !== min) { switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; default: break;} h /= 6; } return { h: h * 360, s: s * 100, v: v * 100, a }; };
const hsvaToRgba = (hsva) => { if (!hsva) return {r:0, g:0, b:0, a:1}; let {h=0, s=100, v=100, a=1} = hsva; s/=100; v/=100; let r=0,g=0,b=0; const i = Math.floor(h/60); const f = h/60 - i; const p = v * (1-s); const q = v * (1-f*s); const t = v * (1-(1-f)*s); switch(i%6){ case 0: r=v; g=t; b=p; break; case 1: r=q; g=v; b=p; break; case 2: r=p; g=v; b=t; break; case 3: r=p; g=q; b=v; break; case 4: r=t; g=p; b=v; break; case 5: r=v; g=p; b=q; break; default: r=v; g=t; b=p; break;} return { r:r*255, g:g*255, b:b*255, a }; };

// Function to handle file uploads and convert to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// --- React Components ---

const ColorPicker = ({ label, color, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const safeColor = color && typeof color === 'string' && color.startsWith('#') ? color : '#000000';
    const [hsva, setHsva] = useState(() => rgbaToHsva(hexToRgba(safeColor)));
    const pickerRef = useRef(null);

    useEffect(() => {
        setHsva(rgbaToHsva(hexToRgba(safeColor)));
    }, [safeColor]);

    useEffect(() => {
        const handleClickOutside = (event) => { if (pickerRef.current && !pickerRef.current.contains(event.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [pickerRef]);

    const handleColorChange = (newHsva) => {
        const newRgba = hsvaToRgba(newHsva);
        onChange(rgbaToHex(newRgba.r, newRgba.g, newRgba.b));
    };
    const handleSaturationValueChange = (e) => {
        const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
        const x = typeof e.clientX === 'undefined' ? e.touches[0].clientX : e.clientX;
        const y = typeof e.clientY === 'undefined' ? e.touches[0].clientY : e.clientY;
        const s = Math.max(0, Math.min(100, (x - left) / width * 100));
        const v = Math.max(0, Math.min(100, 100 - (y - top) / height * 100));
        const newHsva = {...hsva, s, v};
        setHsva(newHsva); handleColorChange(newHsva);
    };
    const handleHueChange = (e) => {
        const h = parseFloat(e.target.value);
        const newHsva = {...hsva, h};
        setHsva(newHsva); handleColorChange(newHsva);
    };

    return (
        <div className="relative">
            <label className="block text-xs text-gray-600 mb-1">{label}</label>
            <div className="w-full h-8 border border-gray-300 rounded-md p-1 flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="w-full h-full rounded" style={{ backgroundColor: safeColor }}></div>
            </div>
            {isOpen && (
                <div ref={pickerRef} className="absolute z-10 top-full mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="w-56 h-32 rounded cursor-crosshair relative" style={{ background: `hsl(${hsva.h}, 100%, 50%)` }}
                        onMouseDown={(e) => {
                            handleSaturationValueChange(e);
                            const onMouseMove = (moveE) => handleSaturationValueChange(moveE);
                            const onMouseUp = () => document.removeEventListener('mousemove', onMouseMove);
                            document.addEventListener('mousemove', onMouseMove);
                            document.addEventListener('mouseup', onMouseUp, { once: true });
                        }}>
                     <div className="absolute inset-0" style={{background: 'linear-gradient(to right, white, transparent)'}}/>
                     <div className="absolute inset-0" style={{background: 'linear-gradient(to top, black, transparent)'}}/>
                     <div className="absolute" style={{left: `${hsva.s}%`, top: `${100-hsva.v}%`, transform: 'translate(-50%, -50%)'}}>
                         <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer"/>
                     </div>
                    </div>
                    <input type="range" min="0" max="360" value={hsva.h} onChange={handleHueChange} className="w-full mt-2 cursor-pointer h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-lg appearance-none"/>
                    <input type="text" value={safeColor} onChange={(e) => onChange(e.target.value)} className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded"/>
                </div>
            )}
        </div>
    );
};
const IconSelector = ({ label, type, selectedIndex, onChange }) => {
    const options = iconOptions[type] || [];
    const handleNext = () => onChange((selectedIndex + 1) % options.length);
    const handlePrev = () => onChange((selectedIndex - 1 + options.length) % options.length);
    const currentIcon = options[selectedIndex];
    
    return (
        <div className="flex flex-col">
            <label className="block text-xs text-gray-600 mb-1">{label}</label>
            <div className="flex items-center justify-between p-1 border border-gray-300 rounded-lg bg-white shadow-sm">
                <button onClick={handlePrev} className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={18}/></button>
                <div className="w-12 h-6 flex items-center justify-center text-indigo-600">
                    {typeof currentIcon === 'string' ? <span className="text-xs font-semibold text-gray-500">{currentIcon}</span> : currentIcon}
                </div>
                <button onClick={handleNext} className="p-1 rounded hover:bg-gray-100"><ChevronRight size={18}/></button>
            </div>
        </div>
    );
};
const CardElement = ({ type, value, cardStyle }) => {
  if (!value?.text) return null;
  const iconSet = iconOptions[type];
  const IconComponent = iconSet ? iconSet[cardStyle[`${type}Icon`]] : null;

  let textStyle = {
      color: cardStyle.textColor,
      fontFamily: cardStyle.fontFamily,
      fontWeight: value.bold ? 'bold' : 'normal',
      fontStyle: value.italic ? 'italic' : 'normal',
      textDecoration: value.underline ? 'underline' : 'none',
      lineHeight: cardStyle.lineSpacing || 1.5,
      fontSize: `${value.fontSize || 14}px`, // Use fontSize from value
  };
  if (type === 'name') textStyle = { ...textStyle, color: cardStyle.primaryColor, fontWeight: value.bold ? '900' : 'bold' }; // Font size handled by value.fontSize
  if (type === 'title') textStyle = { ...textStyle, color: cardStyle.secondaryColor }; // Font size handled by value.fontSize
  
  return (
    <div className={`text-sm flex items-center gap-2 whitespace-nowrap`} style={textStyle}>
      {IconComponent && typeof IconComponent !== 'string' && <span style={{color: cardStyle.primaryColor}}>{IconComponent}</span>}
      <span>{value.text}</span>
    </div>
  );
};
const DraggableElement = ({ elKey, cardStyle, setCardStyle, allPositions, setSnapGuides, children, isSelected, onClick }) => {
    const elRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartPos = useRef({x: 0, y: 0});
    const elStartPos = useRef({x: 0, y: 0});
    const snapThreshold = 2; // Percentage for snapping
    
    const handleMouseDown = (e) => {
        isDragging.current = true;
        dragStartPos.current = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
        elStartPos.current = allPositions[elKey] || { x: 50, y: 50 };
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current || !elRef.current?.parentElement) return;
        const cardRect = elRef.current.parentElement.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        const deltaX = clientX - dragStartPos.current.x; const deltaY = clientY - dragStartPos.current.y;
        const deltaXPercent = (deltaX / cardRect.width) * 100; const deltaYPercent = (deltaY / cardRect.height) * 100;
        let newX = elStartPos.current.x + deltaXPercent; let newY = elStartPos.current.y + deltaYPercent;
        
        const activeGuides = { h: null, v: null };

        // Snap to center
        if (Math.abs(newX - 50) < snapThreshold) { newX = 50; activeGuides.v = 50; }
        if (Math.abs(newY - 50) < snapThreshold) { newY = 50; activeGuides.h = 50; }

        // Snap to other elements
        for (const key in allPositions) {
            if (key !== elKey && allPositions[key]) {
                const otherPos = allPositions[key];
                if (Math.abs(newX - otherPos.x) < snapThreshold) { newX = otherPos.x; activeGuides.v = otherPos.x; }
                if (Math.abs(newY - otherPos.y) < snapThreshold) { newY = otherPos.y; activeGuides.h = otherPos.y; }
            }
        }
        setSnapGuides(activeGuides);

        newX = Math.max(0, Math.min(100, newX)); newY = Math.max(0, Math.min(100, newY));
        setCardStyle(prev => ({...prev, elementPositions: {...prev.elementPositions, [elKey]: { x: newX, y: newY }}}));
    }, [elKey, setCardStyle, allPositions, setSnapGuides]);

    const handleMouseUp = useCallback(() => { isDragging.current = false; setSnapGuides({ h: null, v: null }); }, [setSnapGuides]);

    useEffect(() => {
        const up = () => handleMouseUp();
        window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', handleMouseMove); window.addEventListener('touchend', up);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', handleMouseMove); window.removeEventListener('touchend', up);
        };
    }, [handleMouseMove, handleMouseUp]);

    const pos = cardStyle.elementPositions?.[elKey] || { x: 50, y: 50 };
    return (<div ref={elRef} className={`absolute p-1 -m-1 transition-all duration-100 ${isSelected ? 'outline-dashed outline-1 outline-blue-500' : ''}`} style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-${pos.x}%, -${pos.y}%)`, cursor: 'grab' }} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} onClick={onClick}> {children} </div>);
};
const CardFace = React.forwardRef(({ data, style, side, setCardStyle, setSnapGuides, selectedElement, setSelectedElement }, ref) => {
  const cardRef = useRef(null);
  const monogram = generateMonogram(data.name);
  const cardDynamicStyle = { backgroundColor: style.cardBackgroundColor, fontFamily: style.fontFamily, width: `${CARD_PREVIEW_WIDTH_PX}px`, height: `${CARD_PREVIEW_WIDTH_PX / CARD_ASPECT_RATIO}px`, borderWidth: style.cardBorderWidth || '0px', borderColor: style.cardBorderColor || '#000000', borderStyle: style.cardBorderStyle || 'solid' };
  const getCornerRadiusClass = () => `rounded-${style.cornerRadius || 'lg'}`;
  const finishOverlayStyle = () => {
      switch(style.finish) {
          case 'glossy': return { background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%)', mixBlendMode: 'overlay' };
          case 'linen': return { backgroundImage: "url('https://www.transparenttextures.com/patterns/linen.png')", opacity: 0.1 };
          case 'recycled': return { backgroundImage: "url('https://www.transparenttextures.com/patterns/recycled-paper.png')", opacity: 0.2, mixBlendMode: 'multiply'};
          case 'matte': return { backdropFilter: 'saturate(0.95)' };
          default: return {};
      }
  };
    // Monogram font size should also be controlled by the name's font size
    const monogramFontSize = data.name?.fontSize ? `${data.name.fontSize * 2}px` : '7em'; // Scale name font size for monogram
    const renderMonogram = () => (<div className="flex flex-col items-center justify-center h-full"><h1 className="font-bold" style={{ color: style.primaryColor, fontFamily: style.fontFamily, fontSize: monogramFontSize }}>{monogram}</h1>{(style.backElements || []).includes("website") && data.website.text && <p className="mt-2 text-sm" style={{color: style.secondaryColor}}>{data.website.text}</p>}</div>);
    const elementsToRender = side === 'front' ? style.frontElements : style.backElements;
    const qrCodeOnThisSide = style.qrCode?.enabled && style.qrCode.side === side;

    const handleCardClick = (e) => {
    if (selectedElement && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        setCardStyle(prev => ({...prev, elementPositions: {...prev.elementPositions, [selectedElement]: {x, y}}}));
        setSelectedElement(null);
    }
  };
    
  return (
    <div ref={ref}>
        <div ref={cardRef} className={`card-face shadow-lg p-0 overflow-hidden relative ${getCornerRadiusClass()}`} style={cardDynamicStyle} onClick={handleCardClick}>
            <div className="absolute inset-0 pointer-events-none" style={finishOverlayStyle()}></div>
            {/* Snap guides */}
            {style.snapGuides?.v != null && <div className="absolute top-0 bottom-0 bg-cyan-400 w-px" style={{left: `${style.snapGuides.v}%`}}></div>}
            {style.snapGuides?.h != null && <div className="absolute left-0 right-0 bg-cyan-400 h-px" style={{top: `${style.snapGuides.h}%`}}></div>}

            {/* Render elements based on side and elementPositions */}
            {(elementsToRender || []).map((elKey) => {
                // Handle monogram specifically for the back side
                if (elKey === 'monogram' && side === 'back') {
                    return (
                        <DraggableElement key={elKey} elKey={elKey} data={data} cardStyle={style} setCardStyle={setCardStyle} allPositions={style.elementPositions} setSnapGuides={setSnapGuides} isSelected={selectedElement === elKey} onClick={(e) => {e.stopPropagation(); setSelectedElement(elKey);}}>
                            {renderMonogram()}
                        </DraggableElement>
                    );
                }
                // Handle logo
                else if (elKey === 'logo' && data.logoUrl) {
                    return (
                        <DraggableElement key={elKey} elKey={elKey} data={data} cardStyle={style} setCardStyle={setCardStyle} allPositions={style.elementPositions} setSnapGuides={setSnapGuides} isSelected={selectedElement === elKey} onClick={(e) => {e.stopPropagation(); setSelectedElement(elKey);}}>
                            <img src={data.logoUrl} alt="Logo" className="max-w-[80px] max-h-[80px] object-contain" />
                        </DraggableElement>
                    );
                }
                // Handle headshot
                else if (elKey === 'headshot' && data.headshotUrl) {
                    const headshotSize = style.headshot?.size || 60;
                    const headshotShapeClass = style.headshot?.shape === 'circle' ? 'rounded-full' : 'rounded-lg';
                    return (
                        <DraggableElement key={elKey} elKey={elKey} data={data} cardStyle={style} setCardStyle={setCardStyle} allPositions={style.elementPositions} setSnapGuides={setSnapGuides} isSelected={selectedElement === elKey} onClick={(e) => {e.stopPropagation(); setSelectedElement(elKey);}}>
                            <img src={data.headshotUrl} alt="Headshot" className={`object-cover ${headshotShapeClass}`} style={{ width: `${headshotSize}px`, height: `${headshotSize}px` }} />
                        </DraggableElement>
                    );
                }
                // Handle other text elements
                else if (data[elKey] && elKey !== 'monogram' && elKey !== 'logo' && elKey !== 'headshot') {
                    return (
                        <DraggableElement key={elKey} elKey={elKey} data={data} cardStyle={style} setCardStyle={setCardStyle} allPositions={style.elementPositions} setSnapGuides={setSnapGuides} isSelected={selectedElement === elKey} onClick={(e) => {e.stopPropagation(); setSelectedElement(elKey);}}>
                            <CardElement type={elKey} value={data[elKey]} cardStyle={style} />
                        </DraggableElement>
                    );
                }
                return null;
            })}

            {/* QR Code */}
            {qrCodeOnThisSide && data.website?.text &&
                <DraggableElement elKey="qrcode" data={data} cardStyle={style} setCardStyle={setCardStyle} allPositions={style.elementPositions} setSnapGuides={setSnapGuides} isSelected={selectedElement === 'qrcode'} onClick={(e) => {e.stopPropagation(); setSelectedElement('qrcode');}}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=${style.qrCode.size}x${style.qrCode.size}&data=${encodeURIComponent(data.website.text)}&qzone=1&bgcolor=${(style.cardBackgroundColor || '#FFFFFF').substring(1)}&color=${(style.textColor || '#000000').substring(1)}`} alt="QR Code" style={{width: style.qrCode.size, height: style.qrCode.size}}/>
                </DraggableElement>
            }
        </div>
    </div>
  );
});
const BusinessCardDisplay = ({ cardData, cardStyle, setCardStyle }) => {
  const [isFront, setIsFront] = useState(true);
  const frontFaceRef = useRef(null); const backFaceRef = useRef(null); const flipCard = () => setIsFront(!isFront);
  const [snapGuides, setSnapGuides] = useState({ h: null, v: null });
  const [selectedElement, setSelectedElement] = useState(null);

  const downloadCard = async () => { try { const html2canvas = (await import('html2canvas')).default; const faceToDownload = isFront ? frontFaceRef.current : backFaceRef.current; if (faceToDownload) { const canvas = await html2canvas(faceToDownload, { scale: 3, backgroundColor: null, useCORS: true }); const image = canvas.toDataURL('image/png'); const link = document.createElement('a'); link.href = image; link.download = `business-card-${isFront ? 'front' : 'back'}.png`; link.click(); } } catch (error) { console.error("Error creating card image:", error); } };
    
  const handleAlignment = (align) => {
    let newPositions = { ...cardStyle.elementPositions };
    const elementsToAlign = isFront ? cardStyle.frontElements : cardStyle.backElements;

    elementsToAlign.forEach((key) => {
        if(newPositions[key]) {
            let x;
            if (align === 'staggered') {
              // Stagger elements that are typically textual
              if (['name', 'title', 'company', 'phone', 'email', 'website', 'tagline'].includes(key)) {
                const textElements = elementsToAlign.filter(el => ['name', 'title', 'company', 'phone', 'email', 'website', 'tagline'].includes(el));
                const index = textElements.indexOf(key);
                x = index % 2 === 0 ? 5 : 15;
              } else {
                // Keep other elements (like logo, headshot, QR) at their current X or default
                x = newPositions[key].x;
              }
            }
            else if (align === 'center') x = 50;
            else if (align === 'right') x = 95;
            else x = 5; // Default left align
            newPositions[key] = { ...newPositions[key], x };
        }
    });
    setCardStyle(prev => ({...prev, elementPositions: newPositions}));
  };


  return (
    // Added lg:sticky lg:top-8 to make it stick on large screens
    <div className="w-full lg:w-1/2 p-4 flex flex-col items-center lg:sticky lg:top-8">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center"><Aperture size={24} className="mr-2 text-indigo-600" />Interactive Preview</h2>
        <div className="flex gap-1 border border-gray-300 rounded-lg p-1 bg-white">
          <button title="Align Left" onClick={() => handleAlignment('left')} className={`p-2 rounded hover:bg-gray-100`}><AlignLeft size={16}/></button>
          <button title="Align Center" onClick={() => handleAlignment('center')} className={`p-2 rounded hover:bg-gray-100`}><AlignCenter size={16}/></button>
          <button title="Align Right" onClick={() => handleAlignment('right')} className={`p-2 rounded hover:bg-gray-100`}><AlignRight size={16}/></button>
          <button title="Staggered" onClick={() => handleAlignment('staggered')} className={`p-2 rounded hover:bg-gray-100`}><AlignHorizontalJustifyStart size={16}/></button>
        </div>
      </div>
      <div className="w-full max-w-md" style={{ perspective: '1000px', minHeight: `${(CARD_PREVIEW_WIDTH_PX / CARD_ASPECT_RATIO) + 20}px` }}>
        <div className="relative w-full transition-transform duration-700 ease-in-out" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${isFront ? 0 : 180}deg)`, aspectRatio: `${CARD_ASPECT_RATIO}` }}>
          <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}><CardFace data={cardData} style={{...cardStyle, snapGuides}} side="front" setCardStyle={setCardStyle} setSnapGuides={setSnapGuides} selectedElement={selectedElement} setSelectedElement={setSelectedElement} ref={frontFaceRef} /></div>
          <div className="absolute w-full h-full" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}><CardFace data={cardData} style={cardStyle} side="back" setCardStyle={setCardStyle} setSnapGuides={setSnapGuides} selectedElement={selectedElement} setSelectedElement={setSelectedElement} ref={backFaceRef} /></div>
        </div>
      </div>
      <div className="mt-6 flex space-x-3"><button onClick={flipCard} className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center"><RotateCcw size={18} className="mr-2" /> Flip</button><button onClick={downloadCard} className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 flex items-center"><Download size={18} className="mr-2" /> Download</button></div>
    </div>
  );
};
const EditableInputField = ({ id, label, value, onChange, icon }) => { // Removed onAuxButtonClick, isAuxButtonLoading
  const handleFocus = (event) => event.target.select();
  const handleTextChange = (e) => onChange({ ...value, text: e.target.value });
  const toggleFormat = (format) => onChange({ ...value, [format]: !value[format] });
  const handleFontSizeChange = (e) => onChange({ ...value, fontSize: parseInt(e.target.value, 10) });

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex items-center">{icon} {label}</label>
      </div>
      <div className="flex items-center gap-1">
        <input type="text" id={id} value={value.text} onChange={handleTextChange} onFocus={handleFocus} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
        <button onClick={() => toggleFormat('bold')} className={`p-2 rounded ${value.bold ? 'bg-indigo-200' : 'bg-gray-200'}`}><Bold size={16}/></button>
        <button onClick={() => toggleFormat('italic')} className={`p-2 rounded ${value.italic ? 'bg-indigo-200' : 'bg-gray-200'}`}><Italic size={16}/></button>
        <button onClick={() => toggleFormat('underline')} className={`p-2 rounded ${value.underline ? 'bg-indigo-200' : 'bg-gray-200'}`}><Underline size={16}/></button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <label htmlFor={`${id}-fontSize`} className="sr-only">Font Size</label>
        <TextCursorInput size={16} className="text-gray-500"/>
        <select
          id={`${id}-fontSize`}
          value={value.fontSize || 14} // Default to 14 if not set
          onChange={handleFontSizeChange}
          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg"
        >
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ElementVisibilityToggle = ({ label, elKey, cardStyle, setCardStyle, side }) => {
    const isVisible = side === 'front' ? cardStyle.frontElements.includes(elKey) : cardStyle.backElements.includes(elKey);
    const handleToggle = () => {
        setCardStyle(prev => {
            const currentElements = side === 'front' ? [...prev.frontElements] : [...prev.backElements];
            const updatedElements = isVisible
                ? currentElements.filter(item => item !== elKey)
                : [...currentElements, elKey];
            return {
                ...prev,
                [side === 'front' ? 'frontElements' : 'backElements']: updatedElements
            };
        });
    };
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isVisible} onChange={handleToggle} className="form-checkbox h-4 w-4 text-indigo-600 rounded" />
            {label}
        </label>
    );
};

const CardInputForm = ({ cardData, setCardData, cardStyle, setCardStyle, presets, onSavePreset, onLoadPreset, onDeletePreset, onApplyStyleTemplate }) => {
  // Removed loadingStates as it's no longer needed for AI features
  // const [loadingStates, setLoadingStates] = useState({});
  const [selectedPreset, setSelectedPreset] = useState("Rochelle Elaine Berry");

  // Removed createClickHandler as it was used for AI features

  const handleSavePreset = () => { const name = window.prompt("Enter a name for this preset:"); if (name) { onSavePreset(name); setSelectedPreset(name); } };
  const handleLoadPreset = (e) => { const name = e.target.value; setSelectedPreset(name); if (name) onLoadPreset(name); };
  const handleDeletePreset = () => { if (selectedPreset && defaultPresets[selectedPreset]) { /* Prevent deleting default presets */ } else if (selectedPreset && window.confirm(`Delete preset "${selectedPreset}"?`)) { onDeletePreset(selectedPreset); setSelectedPreset(""); } };
  const updateQrCode = (key, value) => setCardStyle({...cardStyle, qrCode: {...(cardStyle.qrCode || {}), [key]: value}});
  const updateHeadshot = (key, value) => setCardStyle({...cardStyle, headshot: {...(cardStyle.headshot || {}), [key]: value}});

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setCardData(prev => ({ ...prev, logoUrl: base64 }));
      } catch (error) {
        console.error("Error converting logo to base64:", error);
      }
    }
  };

  const handleHeadshotUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setCardData(prev => ({ ...prev, headshotUrl: base64 }));
      } catch (error) {
        console.error("Error converting headshot to base64:", error);
      }
    }
  };
    
  return (
    <div className="w-full lg:w-1/2 p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="mb-6"><h2 className="text-2xl font-semibold text-gray-800 flex items-center"><Info size={28} className="mr-2 text-indigo-600" />Card Information</h2></div>
      {/* Updated EditableInputField to pass font size prop */}
      <EditableInputField id="name" label="Name" value={cardData.name} onChange={v => setCardData({...cardData, name: v})} icon={<Type size={16} className="mr-2"/>} />
      <EditableInputField id="title" label="Title / Position" value={cardData.title} onChange={v => setCardData({...cardData, title: v})} icon={<Briefcase size={16} className="mr-2"/>} />
      <EditableInputField id="company" label="Company (Optional)" value={cardData.company} onChange={v => setCardData({...cardData, company: v})} icon={<Building size={16} className="mr-2"/>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <EditableInputField id="phone" label="Phone" value={cardData.phone} onChange={v => setCardData({...cardData, phone: v})} icon={<Phone size={16} className="mr-2"/>} />
        <EditableInputField id="email" label="Email" value={cardData.email} onChange={v => setCardData({...cardData, email: v})} icon={<Mail size={16} className="mr-2"/>} />
      </div>
      <EditableInputField id="website" label="Website" value={cardData.website} onChange={v => setCardData({...cardData, website: v})} icon={<LinkIcon size={16} className="mr-2"/>} />
      <EditableInputField id="tagline" label="Tagline" value={cardData.tagline} onChange={v => setCardData({...cardData, tagline: v})} icon={<Sparkles size={16} className="mr-2"/>} />
      
      {/* Logo Upload */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 flex items-center">
                <ImageIcon size={16} className="mr-2"/> Logo
            </label>
        </div>
        <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
        {cardData.logoUrl && <div className="mt-2 text-xs text-gray-500">Current logo: <span className="font-mono truncate inline-block max-w-full">{cardData.logoUrl.substring(0, 50)}...</span></div>}
      </div>

      {/* Headshot Upload */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <label htmlFor="headshotUrl" className="block text-sm font-medium text-gray-700 flex items-center">
                <UserCircle2 size={16} className="mr-2"/> Headshot
            </label>
        </div>
        <input type="file" id="headshotUpload" accept="image/*" onChange={handleHeadshotUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
        {cardData.headshotUrl && <div className="mt-2 text-xs text-gray-500">Current headshot: <span className="font-mono truncate inline-block max-w-full">{cardData.headshotUrl.substring(0, 50)}...</span></div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="headshotShape" className="block text-xs text-gray-600 mb-1">Headshot Shape</label>
          <select id="headshotShape" name="headshotShape" value={cardStyle.headshot?.shape || 'circle'} onChange={e => updateHeadshot('shape', e.target.value)} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm">
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div>
          <label htmlFor="headshotSize" className="block text-xs text-gray-600 mb-1">Headshot Size (px)</label>
          <input type="number" id="headshotSize" name="headshotSize" value={cardStyle.headshot?.size || 60} onChange={e => updateHeadshot('size', parseInt(e.target.value))} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm" min="10" max="150" step="5" />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t"><h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><Palette size={28} className="mr-2 text-indigo-600"/>Style & Layout</h2></div>
      
      {/* Style controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <ColorPicker label="Background" color={cardStyle.cardBackgroundColor} onChange={c => setCardStyle({...cardStyle, cardBackgroundColor: c})} />
          <ColorPicker label="Text" color={cardStyle.textColor} onChange={c => setCardStyle({...cardStyle, textColor: c})} />
          <ColorPicker label="Primary" color={cardStyle.primaryColor} onChange={c => setCardStyle({...cardStyle, primaryColor: c})} />
          <ColorPicker label="Secondary" color={cardStyle.secondaryColor} onChange={c => setCardStyle({...cardStyle, secondaryColor: c})} />
      </div>
        <div className="mb-4 pt-4 border-t"><h3 className="text-xl font-semibold mb-4 text-gray-800">Fine-Tuning</h3></div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="fontFamily" className="block text-xs text-gray-600 mb-1">Font Family</label>
                <select id="fontFamily" name="fontFamily" value={cardStyle.fontFamily} onChange={e => setCardStyle({...cardStyle, fontFamily: e.target.value})} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm">
                    <option value="'Inter', sans-serif">Inter</option><option value="'Roboto', sans-serif">Roboto</option><option value="'Poppins', sans-serif">Poppins</option><option value="'Lato', sans-serif">Lato</option><option value="'Montserrat', sans-serif">Montserrat</option><option value="'Oswald', sans-serif">Oswald</option><option value="'Raleway', sans-serif">Raleway</option><option value="'Source Sans 3', sans-serif">Source Sans 3</option><option value="'Merriweather', serif">Merriweather</option><option value="'Playfair Display', serif">Playfair Display</option><option value="'Cormorant Garamond', serif">Cormorant Garamond</option><option value="'EB Garamond', serif">EB Garamond</option><option value="'Lora', serif">Lora</option><option value="'Bebas Neue', sans-serif">Bebas Neue</option><option value="'Dancing Script', cursive">Dancing Script</option><option value="'Pacifico', cursive">Pacifico</option>
                </select>
            </div>
            <div>
                <label htmlFor="lineSpacing" className="block text-xs text-gray-600 mb-1">Line Spacing</label>
                <select id="lineSpacing" name="lineSpacing" value={cardStyle.lineSpacing} onChange={e => setCardStyle({...cardStyle, lineSpacing: parseFloat(e.target.value)})} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm">
                    <option value={1.2}>Tight</option><option value={1.5}>Normal</option><option value={1.8}>Loose</option><option value={2.2}>Very Loose</option>
                </select>
            </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="finish" className="block text-xs text-gray-600 mb-1">Card Finish</label>
                <select id="finish" name="finish" value={cardStyle.finish} onChange={e => setCardStyle({...cardStyle, finish: e.target.value})} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm">
                    <option value="smooth">Smooth</option><option value="matte">Matte</option><option value="glossy">Glossy Sheen</option><option value="linen">Linen Texture</option><option value="recycled">Recycled Paper</option>
                </select>
            </div>
            <div>
                <label htmlFor="cornerRadius" className="block text-xs text-gray-600 mb-1">Corner Radius</label>
                <select id="cornerRadius" name="cornerRadius" value={cardStyle.cornerRadius} onChange={e => setCardStyle({...cardStyle, cornerRadius: e.target.value})} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm">
                    <option value="none">Sharp</option><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option><option value="xl">XL</option><option value="2xl">2XL</option><option value="full">Pill</option>
                </select>
            </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label htmlFor="cardBorderWidth" className="block text-xs text-gray-600 mb-1">Border Width</label>
                <select id="cardBorderWidth" name="cardBorderWidth" value={cardStyle.cardBorderWidth} onChange={e => setCardStyle({...cardStyle, cardBorderWidth: e.target.value})} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm">
                    {Array.from({ length: 21 }, (_, i) => (<option key={i} value={`${i}px`}>{i === 0 ? 'None' : `${i}px`}</option>))}
                </select>
            </div>
            <div><label htmlFor="cardBorderStyle" className="block text-xs text-gray-600 mb-1">Border Style</label><select id="cardBorderStyle" name="cardBorderStyle" value={cardStyle.cardBorderStyle} onChange={e => setCardStyle({...cardStyle, cardBorderStyle: e.target.value})} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm"><option>solid</option><option>dashed</option><option>dotted</option><option>double</option></select></div>
            <div className="md:col-span-1"><ColorPicker label="Border Color" color={cardStyle.cardBorderColor} onChange={c => setCardStyle({...cardStyle, cardBorderColor: c})} /></div>
       </div>
        <div className="mb-4 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon Styles</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <IconSelector label="Phone Icon" type="phone" selectedIndex={cardStyle.phoneIcon || 0} onChange={idx => setCardStyle({...cardStyle, phoneIcon: idx})} />
                <IconSelector label="Email Icon" type="email" selectedIndex={cardStyle.emailIcon || 0} onChange={idx => setCardStyle({...cardStyle, emailIcon: idx})} />
                <IconSelector label="Website Icon" type="website" selectedIndex={cardStyle.websiteIcon || 0} onChange={idx => setCardStyle({...cardStyle, websiteIcon: idx})} />
            </div>
        </div>
        <div className="mb-4 pt-4 border-t">
               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><QrCode className="mr-2"/>QR Code</label>
               <div className="flex items-center gap-4 flex-wrap">
                   <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cardStyle.qrCode?.enabled} onChange={e => updateQrCode('enabled', e.target.checked)}/> Enable</label>
                   <div className="flex items-center gap-2 text-sm"><label>Side:</label><label><input type="radio" name="qrSide" value="front" checked={cardStyle.qrCode?.side === 'front'} onChange={e => updateQrCode('side', e.target.value)}/> F</label><label><input type="radio" name="qrSide" value="back" checked={cardStyle.qrCode?.side === 'back'} onChange={e => updateQrCode('side', e.target.value)}/> B</label></div>
               </div>
        </div>

        {/* Element Visibility */}
        <div className="mb-4 pt-4 border-t">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><List size={24} className="mr-2"/>Element Visibility</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex flex-col gap-2">
                    <h4 className="text-base font-semibold text-gray-700">Front Side</h4>
                    <ElementVisibilityToggle label="Name" elKey="name" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Title" elKey="title" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Company" elKey="company" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Phone" elKey="phone" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Email" elKey="email" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Website" elKey="website" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Tagline" elKey="tagline" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Logo" elKey="logo" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                    <ElementVisibilityToggle label="Headshot" elKey="headshot" cardStyle={cardStyle} setCardStyle={setCardStyle} side="front" />
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-base font-semibold text-gray-700">Back Side</h4>
                    <ElementVisibilityToggle label="Name" elKey="name" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Title" elKey="title" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Company" elKey="company" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Phone" elKey="phone" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Email" elKey="email" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Website" elKey="website" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Tagline" elKey="tagline" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Monogram" elKey="monogram" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Logo" elKey="logo" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                    <ElementVisibilityToggle label="Headshot" elKey="headshot" cardStyle={cardStyle} setCardStyle={setCardStyle} side="back" />
                </div>
            </div>
        </div>

      <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><List size={24} className="mr-2"/>Personal Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <select value={selectedPreset} onChange={handleLoadPreset} className="w-full text-sm p-2 border-gray-300 rounded-lg shadow-sm"><option value="">Load a preset...</option>{Object.keys(presets).map(name => <option key={name} value={name}>{name}</option>)}</select>
             <div className="flex gap-2">
                 <button onClick={handleSavePreset} className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow flex items-center justify-center hover:bg-blue-600"><Save size={16} className="mr-2"/>Save</button>
                 <button onClick={handleDeletePreset} disabled={!selectedPreset || defaultPresets[selectedPreset]} className="w-full px-4 py-2 text-sm bg-red-500 text-white rounded-lg shadow flex items-center justify-center hover:bg-red-600 disabled:opacity-50"><Trash2 size={16} className="mr-2"/>Delete</button>
             </div>
          </div>
      </div>

      {/* Removed AI Styling section */}

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><Palette size={24} className="mr-2"/>Style Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(styleTemplates).map(templateName => (
                <button key={templateName} onClick={() => onApplyStyleTemplate(templateName)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
                    {templateName}
                </button>
            ))}
        </div>
      </div>

    </div>
  );
};

// --- Main App Component ---
function App() {
  const [cardData, setCardData] = useState(defaultPresets["Rochelle Elaine Berry"].cardData);
  // Removed stylePrompt state
  const [cardStyle, setCardStyle] = useState(defaultPresets["Rochelle Elaine Berry"].cardStyle);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [presets, setPresets] = useState({});

  useEffect(() => {
    setIsMounted(true);
    try { const savedPresets = JSON.parse(localStorage.getItem('businessCardPresets_v4')); setPresets({ ...defaultPresets, ...savedPresets }); } catch (e) { setPresets(defaultPresets); }
    try { const fontLink = document.createElement('link'); fontLink.id = 'google-fonts-dynamic'; fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter&family=Roboto&family=Poppins&family=Lato&family=Montserrat&family=Oswald&family=Raleway&family=Source+Sans+3&family=Merriweather&family=Playfair+Display&family=Cormorant+Garamond&family=EB+Garamond&family=Lora&family=Bebas+Neue&family=Dancing+Script&family=Pacifico&display=swap'; fontLink.rel = 'stylesheet'; if (!document.getElementById(fontLink.id)) document.head.appendChild(fontLink); } catch (e) { console.error("Error setting up dynamic styles:", e); }
  }, []);

  const savePresets = (newPresets) => { const presetsToSave = { ...newPresets }; Object.keys(defaultPresets).forEach(key => delete presetsToSave[key]); localStorage.setItem('businessCardPresets_v4', JSON.stringify(presetsToSave)); setPresets(newPresets); };
  // Modified handleSavePreset to not include stylePrompt
  const handleSavePreset = (name) => { savePresets({ ...presets, [name]: { cardData, cardStyle } }); };
  // Modified handleLoadPreset to not try to load stylePrompt
  const handleLoadPreset = (name) => { const p = presets[name]; if (p) { setCardData(p.cardData); setCardStyle(p.cardStyle); /* Removed setStylePrompt(p.stylePrompt || initialStylePrompt); */ } };
  const handleDeletePreset = (name) => { if (defaultPresets[name]) return; const newPresets = { ...presets }; delete newPresets[name]; savePresets(newPresets); };
  const handleApplyStyleTemplate = (name) => { if(styleTemplates[name]) { setCardStyle(prev => ({...prev, ...styleTemplates[name], elementPositions: defaultElementPositions})); /* Removed setStylePrompt(styleTemplates[name].stylePrompt || initialStylePrompt); */ } }

  // Removed all AI API call functions and related useCallback

  if (!isMounted) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 font-sans">
      <header className="text-center mb-10"><h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Business Card Generator</h1><p className="text-lg text-gray-600 mt-2">Design your perfect business card.</p></header> {/* Updated title and tagline */}
      {error && <div className="my-4 p-4 bg-red-100 border-red-400 text-red-700 rounded-lg max-w-3xl mx-auto"><strong>Error:</strong> {error} <button onClick={() => setError(null)} className="ml-4 px-2 py-1 text-xs bg-red-200 rounded">Dismiss</button></div>}
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 max-w-7xl">
        <CardInputForm {...{ cardData, setCardData, cardStyle, setCardStyle, presets, onSavePreset: handleSavePreset, onLoadPreset: handleLoadPreset, onDeletePreset: handleDeletePreset, onApplyStyleTemplate: handleApplyStyleTemplate }}/> {/* Removed AI props */}
        <BusinessCardDisplay cardData={cardData} cardStyle={cardStyle} setCardStyle={setCardStyle} />
      </div>
      <footer className="text-center mt-12 text-sm text-gray-500"><p>&copy; {new Date().getFullYear()} Bizzy Card Build</p></footer>
    </div>
  );
}

export default App;
