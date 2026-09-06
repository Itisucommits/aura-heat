/**
 * AURA-Heat: Citizen Advisory & Public Portal
 * Professional Polish Design Theme
 */

import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Droplets,
  Shield,
  Navigation,
  Phone,
  Clock,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { RAW_WARDS, generateWardProperties } from '../data/wardsGeoData';

type Language = 'en' | 'hi' | 'gu';

const I18N = {
  en: {
    portalTitle: 'AURA-Heat Citizen Safety Portal',
    portalSub: 'Real-time localized heatwave advisories, safety protocols, and free municipal cooling stations.',
    detectLocation: 'Detect My Ward',
    detecting: 'Locating...',
    selectWard: 'Or select your ward manually',
    alertStatusTitle: 'Current Heatwave Status',
    laborBanTitle: 'Outdoor Labor Prohibition (12 PM - 4 PM)',
    laborBanDesc: 'Municipal law prohibits heavy outdoor physical work and construction between 12:00 PM and 4:00 PM.',
    safetyChecklistTitle: 'Personal Heat Safety Protocols',
    checklist: [
      'Drink at least 3-4 liters of water daily, even if not thirsty. Carry electrolyte ORS solution.',
      'Wear lightweight, loose-fitting, light-colored cotton clothing and cover your head with a cloth or umbrella.',
      'Never leave children or pets inside locked parked vehicles, even for a few minutes.',
      'Check in on elderly neighbors twice daily. Watch for confusion, high fever, or lack of sweating (heatstroke signs).',
      'If dizziness or nausea occurs, move immediately to shaded cooling shelters or sprinkle cold water on face and neck.'
    ],
    nearestCoolingTitle: 'Nearest Free Cooling Centers & Water Posts',
    open247: 'Open 24/7 during Orange & Red Alert',
    getDirections: 'Simulate Navigation Route',
    emergencyHelpline: 'AMC Heat Emergency Helpline',
    emergencyNumber: '108 (Ambulance) / 155303 (AMC Helpline)'
  },
  hi: {
    portalTitle: 'ऑरा-हीट नागरिक सुरक्षा पोर्टल',
    portalSub: 'वास्तविक समय स्थानीय हीटवेव सलाह, सुरक्षा नियम और निःशुल्क नगरपालिका शीतलन केंद्र।',
    detectLocation: 'मेरा वार्ड खोजें',
    detecting: 'स्थान खोजा जा रहा है...',
    selectWard: 'या अपना वार्ड स्वयं चुनें',
    alertStatusTitle: 'वर्तमान हीटवेव चेतावनी स्थिति',
    laborBanTitle: 'दोपहर 12 से 4 बजे तक खुले में श्रम कार्य प्रतिबंध',
    laborBanDesc: 'नगर निगम अधिनियम के तहत दोपहर 12 बजे से शाम 4 बजे तक खुले में भारी निर्माण व शारीरिक श्रम पूर्णतः प्रतिबंधित है।',
    safetyChecklistTitle: 'व्यक्तिगत गर्मी सुरक्षा निर्देश',
    checklist: [
      'प्यास न लगने पर भी दिन में कम से कम 3-4 लीटर पानी और ओआरएस/नींबू पानी पिएं।',
      'हल्के रंग के ढीले सूती कपड़े पहनें और धूप में सिर को टोपी, गमछे या छाते से ढकें।',
      'बच्चों और पालतू जानवरों को धूप में बंद गाड़ियों में कभी न छोड़ें।',
      'बुजुर्गों और बीमारों का दिन में दो बार हाल-चाल लें; चक्कर आना या पसीना बंद होना लू (हीटस्ट्रोक) के लक्षण हैं।',
      'यदि कमजोरी या घबराहट महसूस हो, तो तुरंत नजदीकी वातानुकूलित शीतलन केंद्र में जाएं।'
    ],
    nearestCoolingTitle: 'नजदीकी निःशुल्क शीतलन केंद्र और जल सेवा',
    open247: 'ऑरेंज और रेड अलर्ट में 24 घंटे खुला',
    getDirections: 'रास्ता और दिशा निर्देश देखें',
    emergencyHelpline: 'नगर निगम हीट आपातकालीन हेल्पलाइन',
    emergencyNumber: '108 (एम्बुलेंस) / 155303 (एएमसी कंट्रोल रूम)'
  },
  gu: {
    portalTitle: 'ઓરા-હીટ નાગરિક સુરક્ષા પોર્ટલ',
    portalSub: 'રીઅલ-ટાઇમ સ્થાનિક હીટવેવ ચેતવણી, સુરક્ષા નિયમો અને નિઃશુલ્ક કૂલિંગ સેન્ટરો.',
    detectLocation: 'મારો વોર્ડ શોધો',
    detecting: 'શોધી રહ્યું છે...',
    selectWard: 'અથવા તમારો વોર્ડ પસંદ કરો',
    alertStatusTitle: 'હાલની હીટવેવ સ્થિતિ',
    laborBanTitle: 'બપોરે 12 થી 4 દરમિયાન બહાર શ્રમ કાર્ય પર પ્રતિબંધ',
    laborBanDesc: 'મ્યુનિસિપલ કાયદા હેઠળ બપોરે 12:00 થી 4:00 વાગ્યા વચ્ચે બાંધકામ અને ખુલ્લામાં મજૂરી કરવા પર કડક પ્રતિબંધ છે.',
    safetyChecklistTitle: 'હીટવેવથી બચવાના નિયમો',
    checklist: [
      'તરસ ન લાગે તો પણ દિવસ દરમિયાન પુષ્કળ પાણી, છાશ, લીંબુ પાણી અથવા ORS પીવો.',
      'હળવા રંગના સુતરાઉ કપડાં પહેરો અને તડકામાં નીકળતી વખતે માથું ઢાંકી રાખો.',
      'બાળકો અથવા વૃદ્ધોને બંધ વાહનમાં ક્યારેય એકલા ન છોડો.',
      'ઘરના વડીલોનું ધ્યાન રાખો; ચક્કર આવવા, ઊલટી કે અતિશય ગભરામણ લૂ લાગવાના ચિહ્નો છે.',
      'અસ્વસ્થતા જણાય તો તાત્કાલિક નજીકના કૂલિંગ સેન્ટર પર જઈ આરામ કરો.'
    ],
    nearestCoolingTitle: 'નજીકના મફત કૂલિંગ સેન્ટર્સ અને પાણીના પરબ',
    open247: 'ઓરેન્જ અને રેડ એલર્ટ વખતે 24/7 કાર્યરત',
    getDirections: 'રૂટ અને નકશો જુઓ',
    emergencyHelpline: 'AMC હીટ ઇમરજન્સી હેલ્પલાઇન',
    emergencyNumber: '108 (એમ્બ્યુલન્સ) / 155303 (AMC કંટ્રોલ રૂમ)'
  }
};

export const CitizenPortal: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [selectedWardId, setSelectedWardId] = useState<string>('w-01');
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const t = I18N[lang];
  const selectedRaw = RAW_WARDS.find((w) => w.id === selectedWardId) || RAW_WARDS[0];
  const wardProps = generateWardProperties(selectedRaw, 0);

  const detectLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          let closest = RAW_WARDS[0];
          let minDist = 99999;
          RAW_WARDS.forEach((w) => {
            const dist = Math.hypot(w.center[0] - lat, w.center[1] - lon);
            if (dist < minDist) {
              minDist = dist;
              closest = w;
            }
          });
          setSelectedWardId(closest.id);
          setIsDetecting(false);
        },
        () => {
          setSelectedWardId('w-01');
          setIsDetecting(false);
        },
        { timeout: 4000 }
      );
    } else {
      setSelectedWardId('w-01');
      setIsDetecting(false);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'RED':
        return 'bg-red-50 border-red-200 text-red-950';
      case 'ORANGE':
        return 'bg-orange-50 border-orange-200 text-orange-950';
      case 'YELLOW':
        return 'bg-yellow-50 border-yellow-200 text-yellow-950';
      default:
        return 'bg-green-50 border-green-200 text-green-950';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">
      {/* Top Bar with Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">{t.portalTitle}</h1>
            <p className="text-xs text-slate-500">{t.portalSub}</p>
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <Languages className="w-4 h-4 text-slate-400 ml-1.5" />
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              lang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              lang === 'hi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLang('gu')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              lang === 'gu' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ગુજરાતી
          </button>
        </div>
      </div>

      {/* Ward Location Selector */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-600" />
          <span className="text-xs text-slate-600 font-semibold">{t.selectWard}:</span>
          <select
            value={selectedWardId}
            onChange={(e) => setSelectedWardId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-400"
          >
            {RAW_WARDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.ward_name} ({w.zone_name})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={detectLocation}
          disabled={isDetecting}
          className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
        >
          <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
          <span>{isDetecting ? t.detecting : t.detectLocation}</span>
        </button>
      </div>

      {/* Real-Time Alert Status Banner (Professional Polish clean high-contrast card) */}
      <div className={`p-5 rounded-xl border ${getTierBadge(wardProps.alert_tier)} shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                wardProps.alert_tier === 'RED' ? 'bg-red-600 text-white' :
                wardProps.alert_tier === 'ORANGE' ? 'bg-orange-600 text-white' :
                wardProps.alert_tier === 'YELLOW' ? 'bg-yellow-500 text-slate-900' :
                'bg-green-600 text-white'
              }`}>
                {wardProps.alert_tier} ALERT
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {selectedRaw.ward_name} • {selectedRaw.zone_name}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{t.alertStatusTitle}</h2>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-xl">
              {wardProps.tier_advisory}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-xs shrink-0">
            <div className="text-center">
              <p className="text-[9px] text-slate-400 font-bold uppercase">UTCI Felt Temp</p>
              <p className="text-2xl font-bold text-slate-900">{wardProps.utci}°C</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-[9px] text-slate-400 font-bold uppercase">WBGT Stress</p>
              <p className="text-2xl font-bold text-orange-600">{wardProps.max_wbgt}°C</p>
            </div>
          </div>
        </div>

        {/* Mandatory Labor Prohibition Alert */}
        {(wardProps.alert_tier === 'RED' || wardProps.alert_tier === 'ORANGE') && (
          <div className="mt-4 p-3 rounded-lg bg-red-100/70 border border-red-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900 text-xs">{t.laborBanTitle}</p>
              <p className="text-red-800 mt-0.5 leading-relaxed text-[11px]">{t.laborBanDesc}</p>
            </div>
          </div>
        )}
      </div>

      {/* Safety Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>{t.safetyChecklistTitle}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {t.checklist.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 leading-relaxed text-[11px]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nearest Cooling Shelters & Water Tankers */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>{t.nearestCoolingTitle}</span>
            </h3>
            <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.open247}</span>
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {selectedRaw.cooling_center_names?.length || 3} Active Stations in {selectedRaw.ward_name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedRaw.cooling_center_names?.map((shelter, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-cyan-700 px-2 py-0.5 rounded bg-cyan-100/60">
                    Station #{idx + 1}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">~{400 + idx * 350}m away</span>
                </div>
                <div className="font-bold text-slate-900 mt-1.5">{shelter}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Air Cooling • Chilled Water • Free ORS • Resting Beds
                </div>
              </div>

              <button
                onClick={() => setNavigatingTo(shelter)}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors text-[11px]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.getDirections}</span>
              </button>
            </div>
          ))}
        </div>

        {navigatingTo && (
          <div className="mt-4 p-3.5 rounded-lg bg-cyan-50 border border-cyan-200 text-xs text-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-cyan-700" /> Route to: {navigatingTo}
              </span>
              <button onClick={() => setNavigatingTo(null)} className="text-slate-500 hover:text-slate-800">
                ✕
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Head south towards main road • Turn right at the Municipal Dispensary • Station is 450m ahead on left.
              Estimated walking time: 5 minutes.
            </p>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{t.emergencyHelpline}</div>
            <div className="text-slate-500 text-[11px]">{t.emergencyNumber}</div>
          </div>
        </div>
        <div className="text-slate-500 text-[11px]">
          Operational 24/7 during municipal heat emergency phases.
        </div>
      </div>
    </div>
  );
};
