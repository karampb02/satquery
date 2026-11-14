import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06090e] text-slate-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-800/50 text-xs font-mono text-teal-300">
            Project Liquid • NASA Space Apps Challenge 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Project Liquid &amp; NASA SAR Data
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Project Liquid is an interactive, public, open-access Earth-surface change monitoring web application
            developed for the NASA Space Apps Challenge 2026 challenge &ldquo;Dancing with the SARs&rdquo;.
          </p>
        </div>

        {/* Section 1: The NISAR Mission */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-teal-400" />
            The NASA-ISRO NISAR Mission
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The NASA-ISRO Synthetic Aperture Radar (NISAR) mission is a historic collaboration between NASA and the
            Indian Space Research Organisation (ISRO). It represents the world&rsquo;s first dual-frequency (L-band 24 cm
            wavelength and S-band 9 cm wavelength) radar imaging satellite. With an expansive 12-meter deployable mesh
            reflector antenna, NISAR scans almost the entire land and ice surfaces of Earth every 12 days, measuring
            sub-centimeter surface motions and environmental shifts day or night, in any weather.
          </p>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400">Orbit Type:</span> Sun-synchronous, 747 km altitude
            </div>
            <div>
              <span className="text-slate-400">Repeat Cycle:</span> 12 days (exact ground track repeat)
            </div>
            <div>
              <span className="text-slate-400">Primary Instruments:</span> L-SAR (NASA/JPL) &amp; S-SAR (ISRO)
            </div>
            <div>
              <span className="text-slate-400">Antenna:</span> 12-meter unfurlable mesh radar reflector
            </div>
          </div>
        </section>

        {/* Section 2: NASA Data Sources & Products */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-400" />
            Official NASA Data Sources &amp; Catalog
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every layer in Project Liquid is strictly sourced from authorized NASA Earth Science DAACs and distributed
            data providers. Links to each product registry and portal are listed below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                name: "NASA NISAR Mission Portal",
                url: "https://nisar.jpl.nasa.gov",
                desc: "Official JPL mission overview, science objectives, and launch updates.",
              },
              {
                name: "NISAR on NASA Earthdata",
                url: "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/nisar",
                desc: "NASA Earth Science Data Systems platform specification for NISAR products.",
              },
              {
                name: "NISAR Data Access Overview (ASF)",
                url: "https://nisar-docs.asf.alaska.edu/access-overview",
                desc: "Alaska Satellite Facility DAAC documentation on GCOV, GUNW, and GSLC access.",
              },
              {
                name: "ASF Vertex Search",
                url: "https://search.asf.alaska.edu",
                desc: "Interactive spatial search portal for Sentinel-1 and NISAR radar granules.",
              },
              {
                name: "NASA Earthdata Search",
                url: "https://search.earthdata.nasa.gov",
                desc: "Discovery and order system for NASA EOSDIS data collections.",
              },
              {
                name: "ASF DAAC",
                url: "https://www.earthdata.nasa.gov/centers/asf-daac",
                desc: "NASA Distributed Active Archive Center for synthetic aperture radar data.",
              },
              {
                name: "NASA OPERA Project",
                url: "https://www.jpl.nasa.gov/go/opera",
                desc: "Observational Products for End-Users from Remote Sensing Analysis (DSWx, DIST, DISP).",
              },
              {
                name: "NASA GIBS Tile Services",
                url: "https://gibs.earthdata.nasa.gov",
                desc: "Global Imagery Browse Services delivering rapid full-resolution basemaps.",
              },
              {
                name: "NASA Worldview",
                url: "https://worldview.earthdata.nasa.gov",
                desc: "Interactive exploration of over 1,000 global NASA satellite imagery layers.",
              },
            ].map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-800/80 transition-all group"
              >
                <div className="text-xs font-bold text-teal-300 group-hover:text-teal-200 flex items-center justify-between">
                  <span>{src.name}</span>
                  <span className="text-xxs font-mono text-slate-400">↗</span>
                </div>
                <div className="text-xxs text-slate-400 mt-1">{src.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 3: Processing Pipeline & Methods */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
            SAR Science &amp; Processing Methodology
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              Project Liquid utilizes standard open-source geospatial libraries (<code>rasterio</code>,{" "}
              <code>numpy</code>, <code>scipy</code>, <code>geopandas</code>, <code>shapely</code>,{" "}
              <code>asf_search</code>, <code>earthaccess</code>) structured across reproducible modules in{" "}
              <code>/scripts</code>:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs font-mono text-slate-300 bg-slate-900/70 p-4 rounded-lg border border-slate-800">
              <li>
                <strong className="text-teal-300">Radiometric Calibration to dB:</strong> Digital numbers converted
                via &sigma;°_dB = 10 * log10(DN² + &epsilon;) - K, calibrated for backscatter intensity.
              </li>
              <li>
                <strong className="text-teal-300">Speckle Suppression:</strong> Adaptive Lee spatial window filtering
                mitigates coherent SAR speckle while preserving sharp topographic edges.
              </li>
              <li>
                <strong className="text-teal-300">Multi-Temporal Log-Ratio:</strong> Decibel difference masks (&Delta;dB =
                &sigma;°_after - &sigma;°_before) delineate surface water expansion and canopy collapse.
              </li>
              <li>
                <strong className="text-teal-300">InSAR Phase Displacement:</strong> Line-of-sight displacement computed
                via d_LOS = -(&lambda; / 4&pi;) * &Delta;&phi;, colormapped with cyclical 2&pi; interferometric fringes.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Data Limitations & Provenance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-pink-400" />
            Limitations &amp; Data Provenance
          </h2>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong>Data Provenance Notice:</strong> NISAR is currently undergoing final pre-launch and early
              orbit cal/val checkout phases. In accordance with NASA Space Apps Challenge guidance, where full NISAR L-band
              multi-temporal series are limited, Project Liquid integrates NASA/JPL OPERA operational SAR products
              (Dynamic Surface Water DSWx-S1, Disturbance Alert DIST-ALERT-S1, and Displacement DISP-S1) derived from
              validated Synthetic Aperture Radar.
            </p>
            <p>
              All scene bundles are statically verified, marked with exact granule identifiers, and tagged as &ldquo;real&rdquo;
              or &ldquo;sample&rdquo; in both <code>meta.json</code> and in-app badges.
            </p>
          </div>
        </section>

        {/* Section 5: Credits & Licenses */}
        <section id="credits" className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-teal-400" />
            Credits &amp; Open Source Licenses
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Project Liquid is built exclusively upon free, open-source geospatial and web technologies:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: "MapLibre GL JS", url: "https://maplibre.org", license: "BSD-3-Clause", role: "WebGL Map Engine" },
              { name: "Next.js", url: "https://nextjs.org", license: "MIT License", role: "React Web Framework" },
              { name: "Rasterio", url: "https://github.com/rasterio/rasterio", license: "BSD-3-Clause", role: "Geospatial Raster I/O" },
              { name: "GeoPandas", url: "https://github.com/geopandas/geopandas", license: "BSD-3-Clause", role: "Vector Geospatial Data" },
              { name: "FastAPI", url: "https://github.com/fastapi/fastapi", license: "MIT License", role: "Python Backend Framework" },
              { name: "Recharts", url: "https://github.com/recharts/recharts", license: "MIT License", role: "Time Series Visualizations" },
              { name: "asf_search", url: "https://github.com/asfadmin/Discovery-asf_search", license: "BSD-3-Clause", role: "ASF DAAC Search Client" },
              { name: "earthaccess", url: "https://github.com/nsidc/earthaccess", license: "MIT License", role: "NASA Earthdata Access Client" },
            ].map((lib) => (
              <a
                key={lib.name}
                href={lib.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200">{lib.name}</div>
                  <div className="text-xxs text-slate-400">{lib.role}</div>
                </div>
                <div className="text-xxs font-mono text-teal-400 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded">
                  {lib.license}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 6: SI (AI) Disclosure */}
        <section id="disclosure" className="space-y-4 border-t border-slate-800 pt-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-teal-950/90 border border-teal-800/80 text-teal-300 font-mono text-xs font-bold">
              Built with AI assistance
            </span>
            <h2 className="text-xl font-bold text-white">AI Disclosure Statement</h2>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              In full compliance with NASA Space Apps Challenge regulations, this project discloses the use of generative AI
              assistance. AI tools were utilized strictly for code scaffolding, boilerplate generation, and scientific documentation
              formatting.
            </p>
            <p>
              <strong>Visual Assets:</strong> All diagrams, radar explainers, and icons are custom vector SVG illustrations. No
              AI-generated imagery was used.
            </p>
            <p>
              See complete details in{" "}
              <a
                href="https://github.com/karampb02/satquery/blob/main/SI_DISCLOSURE.md"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 underline"
              >
                /SI_DISCLOSURE.md
              </a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
