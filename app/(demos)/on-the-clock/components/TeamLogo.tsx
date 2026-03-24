'use client';

import { ALL_NFL_FRANCHISES } from '../data/teams';

interface TeamLogoProps {
  abbr: string;
  size?: number;
  className?: string;
}

// Map team abbreviation to primary color from the teams data
function getTeamColor(abbr: string): string {
  const team = ALL_NFL_FRANCHISES.find((t) => t.abbr === abbr);
  return team?.color ?? '#666666';
}

function getTeamAltColor(abbr: string): string {
  const team = ALL_NFL_FRANCHISES.find((t) => t.abbr === abbr);
  return team?.colorAlt ?? '#FFFFFF';
}

// Each team gets a simplified geometric SVG icon
// viewBox is 0 0 24 24, rendered as simple paths
function TeamIcon({ abbr }: { abbr: string }) {
  const color = getTeamColor(abbr);
  const alt = getTeamAltColor(abbr);

  switch (abbr) {
    // LV Raiders — crossed swords
    case 'LV':
      return (
        <>
          <path d="M4 4L20 20M4 20L20 4" stroke={alt} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="12" r="3" fill={alt} />
        </>
      );

    // NYJ Jets — jet/arrow pointing up-right
    case 'NYJ':
      return (
        <path
          d="M4 20L12 4L20 20L12 15Z"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      );

    // ARI Cardinals — bird silhouette
    case 'ARI':
      return (
        <path
          d="M12 2L8 8L4 7L7 12L4 20H10L12 16L14 20H20L17 12L20 7L16 8Z"
          fill={color}
        />
      );

    // TEN Titans — flame/sword
    case 'TEN':
      return (
        <>
          <path d="M12 2L9 10H11V22H13V10H15Z" fill={color} />
          <path d="M8 8L6 12L10 10Z" fill={alt} />
          <path d="M16 8L18 12L14 10Z" fill={alt} />
        </>
      );

    // NYG Giants — lightning bolt
    case 'NYG':
      return (
        <path
          d="M13 2L6 13H11L10 22L18 11H13Z"
          fill={color}
        />
      );

    // CLE Browns — helmet shape
    case 'CLE':
      return (
        <>
          <path
            d="M6 8C6 4.7 8.7 2 12 2S18 4.7 18 8V14C18 15.1 17.1 16 16 16H8C6.9 16 6 15.1 6 14Z"
            fill={alt}
          />
          <path d="M6 12H18" stroke={color} strokeWidth="2.5" />
          <rect x="4" y="15" width="16" height="3" rx="1" fill={color} />
        </>
      );

    // WAS Commanders — star with W
    case 'WAS':
      return (
        <>
          <polygon
            points="12,2 14.5,9 22,9 16,13.5 18,21 12,17 6,21 8,13.5 2,9 9.5,9"
            fill={alt}
          />
          <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="bold" fill={color}>W</text>
        </>
      );

    // NO Saints — simplified fleur-de-lis
    case 'NO':
      return (
        <path
          d="M12 2C12 2 9 6 9 9C9 11 10 12 12 12C14 12 15 11 15 9C15 6 12 2 12 2Z
             M12 12V22
             M7 16C5 16 4 14 4 12C4 10 6 9 8 9
             M17 16C19 16 20 14 20 12C20 10 18 9 16 9"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      );

    // KC Chiefs — arrowhead
    case 'KC':
      return (
        <path
          d="M12 2L4 22H12L12 16L12 22H20Z"
          fill={color}
        />
      );

    // CIN Bengals — tiger stripes
    case 'CIN':
      return (
        <>
          <circle cx="12" cy="12" r="10" fill={color} />
          <path d="M6 6L10 10M14 6L10 10" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 12H8M16 12H18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 18L10 14M14 14L18 18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </>
      );

    // MIA Dolphins — dolphin silhouette
    case 'MIA':
      return (
        <path
          d="M3 14C5 10 8 8 12 8C16 8 18 10 20 8L19 12C18 14 16 15 14 15C12 15 11 16 10 18L8 20C7 18 5 16 3 14Z
             M14 10.5A1 1 0 1 0 14 11.5A1 1 0 1 0 14 10.5Z"
          fill={color}
          fillRule="evenodd"
        />
      );

    // DAL Cowboys — five-point star
    case 'DAL':
      return (
        <polygon
          points="12,2 14.9,8.8 22,9.6 16.8,14.4 18.2,22 12,18.4 5.8,22 7.2,14.4 2,9.6 9.1,8.8"
          fill={color}
          stroke={alt}
          strokeWidth="0.8"
        />
      );

    // LAR Rams — curling horn/spiral
    case 'LAR':
      return (
        <path
          d="M18 4C14 4 10 6 8 10C6 14 7 18 10 20
             M18 4C18 8 16 12 12 14
             M18 4L20 2"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );

    // BAL Ravens — bird head profile
    case 'BAL':
      return (
        <path
          d="M6 18C6 12 8 8 12 6L16 4L20 6L18 8L20 10C20 14 18 16 14 18L10 20H6Z
             M14 9A1.5 1.5 0 1 0 14 12A1.5 1.5 0 1 0 14 9Z"
          fill={color}
          fillRule="evenodd"
        />
      );

    // TB Buccaneers — skull and crossbones flag
    case 'TB':
      return (
        <>
          <line x1="6" y1="2" x2="6" y2="22" stroke={alt} strokeWidth="2" />
          <path d="M6 3H20L18 8L20 13H6Z" fill={color} />
          <circle cx="13" cy="7.5" r="2" fill={alt} />
          <path d="M11 10L15 10" stroke={alt} strokeWidth="1" />
        </>
      );

    // DET Lions — lion head
    case 'DET':
      return (
        <path
          d="M12 4L8 2L6 6L4 8L6 12L4 16L8 20L12 22L16 20L20 16L18 12L20 8L18 6L16 2Z"
          fill={color}
        />
      );

    // MIN Vikings — V with horns
    case 'MIN':
      return (
        <>
          <path d="M4 4L8 2L12 14L16 2L20 4" fill="none" stroke={alt} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14L12 22L16 14" fill={color} stroke={color} strokeWidth="1" />
        </>
      );

    // CAR Panthers — panther head
    case 'CAR':
      return (
        <path
          d="M4 8L2 4L6 6L10 4L14 4L18 6L22 4L20 8L22 12L20 16L16 20L12 22L8 20L4 16L2 12Z
             M9 10A1 1 0 1 0 9 12A1 1 0 1 0 9 10Z
             M15 10A1 1 0 1 0 15 12A1 1 0 1 0 15 10Z"
          fill={color}
          fillRule="evenodd"
        />
      );

    // PIT Steelers — three hypocycloid diamonds
    case 'PIT':
      return (
        <>
          <circle cx="12" cy="12" r="10" fill={color} stroke={alt} strokeWidth="1" />
          <polygon points="8,6 10,8 8,10 6,8" fill={alt} />
          <polygon points="14,6 16,8 14,10 12,8" fill="#E31837" />
          <polygon points="11,12 13,14 11,16 9,14" fill="#0080C6" />
        </>
      );

    // LAC Chargers — lightning bolt
    case 'LAC':
      return (
        <path
          d="M14 2L6 13H11L9 22L18 11H13Z"
          fill={color}
          stroke={alt}
          strokeWidth="0.5"
        />
      );

    // PHI Eagles — eagle wing spread
    case 'PHI':
      return (
        <path
          d="M12 4L4 10L2 8L6 14L2 20L8 16L12 22L16 16L22 20L18 14L22 8L20 10Z"
          fill={color}
        />
      );

    // CHI Bears — bold C shape
    case 'CHI':
      return (
        <path
          d="M16 4C10 4 5 7.6 5 12S10 20 16 20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      );

    // BUF Bills — buffalo silhouette
    case 'BUF':
      return (
        <path
          d="M4 16L6 10L4 8L6 6L10 4L8 8L12 6L18 6L22 8L20 12L22 16L18 14L14 16L10 14L6 16Z"
          fill={color}
        />
      );

    // SF 49ers — oval with SF
    case 'SF':
      return (
        <>
          <ellipse cx="12" cy="12" rx="10" ry="8" fill={color} />
          <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill={alt}>SF</text>
        </>
      );

    // HOU Texans — star with bull horns
    case 'HOU':
      return (
        <>
          <polygon
            points="12,6 13.8,10 18,10.5 15,13.5 16,18 12,15.5 8,18 9,13.5 6,10.5 10.2,10"
            fill={color}
          />
          <path d="M4 6L8 10M20 6L16 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </>
      );

    // NE Patriots — tricorn hat shape
    case 'NE':
      return (
        <>
          <path d="M4 16L12 4L20 16Z" fill={color} />
          <path d="M8 16H16V20H8Z" fill={alt} />
          <polygon points="12,6 13,8 11,8" fill={alt} />
        </>
      );

    // SEA Seahawks — hawk head
    case 'SEA':
      return (
        <path
          d="M6 18L4 14L8 10L6 6L10 4L14 4L20 8L22 6L20 12L22 16L18 14L14 18L10 20Z
             M14 8A1.5 1.5 0 1 0 14 11A1.5 1.5 0 1 0 14 8Z"
          fill={color}
          fillRule="evenodd"
        />
      );

    // ATL Falcons — falcon diving shape
    case 'ATL':
      return (
        <path
          d="M12 2L6 8L4 6L6 14L2 22L12 16L22 22L18 14L20 6L18 8Z"
          fill={color}
        />
      );

    // GB Packers — G in oval
    case 'GB':
      return (
        <>
          <ellipse cx="12" cy="12" rx="10" ry="10" fill={color} />
          <text x="12" y="16" textAnchor="middle" fontSize="14" fontWeight="bold" fill={alt}>G</text>
        </>
      );

    // JAX Jaguars — jaguar head
    case 'JAX':
      return (
        <path
          d="M4 10L2 6L6 8L10 4L14 4L18 8L22 6L20 10L22 14L20 18L16 20L12 22L8 20L4 18L2 14Z
             M9 10A1.5 1.5 0 1 0 9 13A1.5 1.5 0 1 0 9 10Z
             M15 10A1.5 1.5 0 1 0 15 13A1.5 1.5 0 1 0 15 10Z"
          fill={color}
          fillRule="evenodd"
        />
      );

    // IND Colts — horseshoe
    case 'IND':
      return (
        <path
          d="M6 4V14C6 17.3 8.7 20 12 20S18 17.3 18 14V4"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      );

    // DEN Broncos — horse head profile
    case 'DEN':
      return (
        <path
          d="M8 22L6 16L4 14L6 10L8 6L10 2L14 4L18 4L20 8L18 12L20 14L18 18L14 20L10 20Z"
          fill={color}
        />
      );

    default:
      return null;
  }
}

export default function TeamLogo({ abbr, size = 32, className }: TeamLogoProps) {
  const hasIcon = [
    'LV','NYJ','ARI','TEN','NYG','CLE','WAS','NO','KC','CIN',
    'MIA','DAL','LAR','BAL','TB','DET','MIN','CAR','PIT','LAC',
    'PHI','CHI','BUF','SF','HOU','NE','SEA','ATL','GB','JAX',
    'IND','DEN',
  ].includes(abbr);

  const color = getTeamColor(abbr);

  if (!hasIcon) {
    // Fallback: abbreviation text in a colored circle
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        role="img"
        aria-label={`${abbr} logo`}
      >
        <circle cx="12" cy="12" r="11" fill={color} />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize={abbr.length > 2 ? '6' : '8'}
          fontWeight="bold"
          fill="#FFFFFF"
        >
          {abbr}
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={`${abbr} logo`}
    >
      <TeamIcon abbr={abbr} />
    </svg>
  );
}
