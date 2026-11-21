import React from 'react';

/**
 * Maca Pita — the friendly math-loving cat mascot!
 * mood: 'happy' | 'teacher' | 'thinking' | 'cheering' | 'oops' | 'cool'
 */
export default function CatMascot({
  mood = 'happy',
  size = 110,
  className = '',
  onClick,
  title,
}) {
  const isTeacher = mood === 'teacher';
  const isCheering = mood === 'cheering';
  const isThinking = mood === 'thinking';
  const isOops = mood === 'oops';
  const isCool = mood === 'cool';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cat-mascot cat-mood-${mood} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={title || 'Maca Pita maskota'}
    >
      <title>{title || 'Maca Pita'}</title>

      {/* Soft shadow */}
      <ellipse cx="70" cy="130" rx="40" ry="7" fill="rgba(0,0,0,0.10)" />

      {/* Cheering sparkles */}
      {isCheering && (
        <g className="cat-sparkles">
          <path
            d="M18 32 L21 24 L24 32 L32 35 L24 38 L21 46 L18 38 L10 35 Z"
            fill="#FFC800"
          />
          <path
            d="M116 24 L118 18 L120 24 L126 26 L120 28 L118 34 L116 28 L110 26 Z"
            fill="#58CC02"
          />
          <circle cx="124" cy="60" r="4" fill="#1CB0F6" />
          <circle cx="16" cy="66" r="3.5" fill="#FF4B4B" />
        </g>
      )}

      {/* Wagging Tail */}
      <path
        className="cat-tail"
        d="M101 112 C123 110, 131 90, 120 77 C115 71, 108 75, 111 82 C114 89, 109 98, 99 101"
        stroke="#FF9600"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="cat-tail"
        d="M120 77 C116 72, 111 74, 111 80"
        stroke="#FFF4E0"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body */}
      <path
        d="M42 94 C39 114, 44 126, 70 126 C96 126, 101 114, 98 94 C95 81, 45 81, 42 94 Z"
        fill="#FF9600"
      />
      {/* Belly cream patch */}
      <ellipse cx="70" cy="109" rx="18" ry="15" fill="#FFF4E0" />

      {/* Cute green bowtie (Duolingo tribute!) */}
      <g transform="translate(70, 91)">
        <path d="M-13 -6 L0 0 L-13 6 Z" fill="#58CC02" stroke="#46A302" strokeWidth="1.5" />
        <path d="M13 -6 L0 0 L13 6 Z" fill="#58CC02" stroke="#46A302" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3.5" fill="#46A302" />
      </g>

      {/* Left & Right Ears */}
      <g className="cat-ears">
        {/* Left Ear */}
        <path
          d="M32 54 L26 20 Q26 15 31 18 L55 34 Z"
          fill="#FF9600"
          stroke="#E07D00"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M35 47 L31 25 L49 36 Z" fill="#FFB8C6" />

        {/* Right Ear */}
        <path
          d="M108 54 L114 20 Q114 15 109 18 L85 34 Z"
          fill="#FF9600"
          stroke="#E07D00"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M105 47 L109 25 L91 36 Z" fill="#FFB8C6" />
      </g>

      {/* Head */}
      <path
        d="M28 62 C28 38, 46 30, 70 30 C94 30, 112 38, 112 62 C112 83, 95 93, 70 93 C45 93, 28 83, 28 62 Z"
        fill="#FFA726"
        stroke="#E07D00"
        strokeWidth="2"
      />

      {/* Forehead tabby stripes */}
      <path d="M64 31 L65 40" stroke="#D96B00" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M70 30 L70 42" stroke="#D96B00" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M76 31 L75 40" stroke="#D96B00" strokeWidth="3.5" strokeLinecap="round" />

      {/* Side cheek stripes */}
      <path d="M31 58 L39 59" stroke="#D96B00" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 65 L38 65" stroke="#D96B00" strokeWidth="3" strokeLinecap="round" />
      <path d="M109 58 L101 59" stroke="#D96B00" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 65 L102 65" stroke="#D96B00" strokeWidth="3" strokeLinecap="round" />

      {/* Cream muzzle */}
      <ellipse cx="62" cy="74" rx="11" ry="8.5" fill="#FFF4E0" />
      <ellipse cx="78" cy="74" rx="11" ry="8.5" fill="#FFF4E0" />

      {/* Rosy cheeks */}
      <ellipse cx="44" cy="71" rx="6" ry="3.5" fill="#FF8A9E" opacity="0.55" />
      <ellipse cx="96" cy="71" rx="6" ry="3.5" fill="#FF8A9E" opacity="0.55" />

      {/* Eyes based on mood */}
      <g className="cat-eyes">
        {isCool ? (
          <g>
            {/* Cool sunglasses */}
            <rect x="40" y="49" width="24" height="15" rx="4" fill="#1F2937" />
            <rect x="76" y="49" width="24" height="15" rx="4" fill="#1F2937" />
            <path d="M64 55 L76 55" stroke="#1F2937" strokeWidth="3" />
            <path d="M44 53 L52 60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M80 53 L88 60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : isOops ? (
          <g>
            {/* Dizzy / oops X or wide worried eyes */}
            <circle cx="52" cy="56" r="8" fill="#FFFFFF" />
            <circle cx="88" cy="56" r="8" fill="#FFFFFF" />
            <circle cx="52" cy="57" r="4" fill="#1F2937" />
            <circle cx="88" cy="57" r="4" fill="#1F2937" />
            <path d="M44 46 L58 49" stroke="#9A4200" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M96 46 L82 49" stroke="#9A4200" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sweat drop */}
            <path
              d="M107 40 C110 45, 112 49, 109 52 C106 55, 102 52, 104 48 Z"
              fill="#1CB0F6"
            />
          </g>
        ) : isCheering ? (
          <g>
            {/* Happy curved cheering eyes */}
            <path
              d="M44 58 Q52 48 60 58"
              stroke="#1F2937"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M80 58 Q88 48 96 58"
              stroke="#1F2937"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          <g>
            {/* Standard cute big bright eyes */}
            <circle cx="52" cy="56" r="8.5" fill="#1F2937" />
            <circle cx="88" cy="56" r="8.5" fill="#1F2937" />
            {/* Eye shine */}
            <circle cx="55" cy="53" r="3" fill="#FFFFFF" />
            <circle cx="91" cy="53" r="3" fill="#FFFFFF" />
            <circle cx="49" cy="59" r="1.5" fill="#FFFFFF" />
            <circle cx="85" cy="59" r="1.5" fill="#FFFFFF" />
            {isThinking && (
              <>
                <path d="M44 45 Q52 42 59 46" stroke="#9A4200" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M81 47 Q88 45 96 48" stroke="#9A4200" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* Teacher round glasses */}
        {isTeacher && (
          <g stroke="#1CB0F6" strokeWidth="2.6" fill="rgba(28,176,246,0.08)">
            <circle cx="52" cy="56" r="12" />
            <circle cx="88" cy="56" r="12" />
            <path d="M64 56 L76 56" fill="none" />
            <path d="M32 54 L40 55" fill="none" />
            <path d="M100 55 L108 54" fill="none" />
          </g>
        )}
      </g>

      {/* Cute pink nose */}
      <path d="M66 67 L74 67 L70 72 Z" fill="#FF5D8F" />

      {/* Mouth */}
      {isOops ? (
        <ellipse cx="70" cy="78" rx="4.5" ry="5.5" fill="#7A2E3A" />
      ) : isCheering ? (
        <path
          d="M62 74 Q70 85 78 74 Z"
          fill="#FF5D8F"
          stroke="#7A2E3A"
          strokeWidth="2"
        />
      ) : (
        <path
          d="M62 75 Q66 79 70 74 Q74 79 78 75"
          stroke="#4A2C11"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Whiskers */}
      <g stroke="#6B3E14" strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
        <path d="M22 68 L39 71" />
        <path d="M20 76 L38 76" />
        <path d="M23 84 L39 81" />

        <path d="M118 68 L101 71" />
        <path d="M120 76 L102 76" />
        <path d="M117 84 L101 81" />
      </g>

      {/* Paws */}
      {isCheering ? (
        <g>
          <ellipse cx="34" cy="84" rx="8" ry="11" transform="rotate(-30 34 84)" fill="#FFA726" stroke="#E07D00" strokeWidth="1.5" />
          <ellipse cx="106" cy="84" rx="8" ry="11" transform="rotate(30 106 84)" fill="#FFA726" stroke="#E07D00" strokeWidth="1.5" />
        </g>
      ) : isThinking ? (
        <g>
          <ellipse cx="47" cy="118" rx="9" ry="7" fill="#FFF4E0" stroke="#E07D00" strokeWidth="1.5" />
          {/* One paw raised to chin */}
          <ellipse cx="83" cy="85" rx="8" ry="9" transform="rotate(-20 83 85)" fill="#FFA726" stroke="#E07D00" strokeWidth="1.5" />
        </g>
      ) : (
        <g>
          <ellipse cx="49" cy="121" rx="10" ry="7" fill="#FFF4E0" stroke="#E07D00" strokeWidth="1.5" />
          <ellipse cx="91" cy="121" rx="10" ry="7" fill="#FFF4E0" stroke="#E07D00" strokeWidth="1.5" />
        </g>
      )}

      {/* Small graduation / math badge if teacher */}
      {isTeacher && (
        <g transform="translate(96, 102)">
          <rect x="0" y="0" width="22" height="16" rx="4" fill="#1CB0F6" stroke="#0B87C4" strokeWidth="1.5" />
          <text
            x="11"
            y="12"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="900"
            fontFamily="Nunito, sans-serif"
          >
            π
          </text>
        </g>
      )}
    </svg>
  );
}
