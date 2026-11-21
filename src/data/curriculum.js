import { grade1 } from './grade1';
import { grade2 } from './grade2';
import { grade3 } from './grade3';
import { grade4 } from './grade4';

export const GRADES = [grade1, grade2, grade3, grade4];

export const ALL_TOPICS = GRADES.flatMap((g) =>
  g.topics.map((t) => ({
    ...t,
    gradeId: g.id,
    gradeTitle: g.title,
    gradeColor: g.color,
    gradeDarkColor: g.darkColor,
  }))
);

export const CAT_TIPS = [
  'Mjau! Klikni na bilo koju oblast na putanji da odmah počneš učenje!',
  'Tajna matematike: ne bubaj formule, shvati ZAŠTO rade na jednom prostom primeru.',
  'Pogrešiti u vežbi je super — tada mozak najviše uči. Samo napred!',
  'Za kvadrat binoma $(a+b)^2$ uvek seti se srednjeg člana $2ab$! Maca te gleda!',
  'Sinus je na $y$-osi, kosinus na $x$-osi. Kratko i jasno!',
  'Ako zapneš na zadatku, otvori "Macin Šalabahter" sa strane za sve formule.',
];
