import { schwerExtra } from './questions-schwer-extra'
import { extraLeicht, extraMittel, extraSchwer } from './questions-extra'
import { bulkLeicht, bulkMittel, bulkSchwer } from './questions-bulk'
import { more350Leicht, more350Mittel, more350Schwer } from './questions-350'

const baseQuestions = [
  // ===================== LEICHT (100 Fragen) =====================
  {
    question: "Für welches Land spielt Lionel Messi?",
    answers: ["Portugal", "Argentinien", "Brasilien", "Deutschland"],
    correctIndex: 1,
    explanation: "Lionel Messi spielt für Argentinien.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Welche Position spielt Manuel Neuer?",
    answers: ["Stürmer", "Torwart", "Verteidiger", "Trainer"],
    correctIndex: 1,
    explanation: "Manuel Neuer ist Torwart beim FC Bayern München.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Wie viele Spieler hat eine Fußballmannschaft auf dem Platz?",
    answers: ["9", "10", "11", "12"],
    correctIndex: 2,
    explanation: "Eine Fußballmannschaft hat 11 Spieler auf dem Platz.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Farbe hat die Karte, die ein Spieler bei einem schweren Foul bekommt?",
    answers: ["Blau", "Grün", "Gelb", "Rot"],
    correctIndex: 3,
    explanation: "Bei einem schweren Foul gibt es die Rote Karte und der Spieler muss vom Platz.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Für welches Land spielt Cristiano Ronaldo?",
    answers: ["Spanien", "Brasilien", "Portugal", "Frankreich"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo spielt für Portugal.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Wer gewann die Fußball-WM 2022?",
    answers: ["Deutschland", "Frankreich", "Argentinien", "Brasilien"],
    correctIndex: 2,
    explanation: "Argentinien gewann die WM 2022 im Finale gegen Frankreich.",
    difficulty: "leicht",
    category: "Weltmeisterschaft"
  },
  {
    question: "Wie heißt der berühmte Fußballverein aus München?",
    answers: ["Borussia Dortmund", "FC Bayern München", "Schalke 04", "RB Leipzig"],
    correctIndex: 1,
    explanation: "Der FC Bayern München ist der berühmteste Verein aus München.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Was passiert bei einem Elfmeter?",
    answers: ["Freistoß vom Mittelkreis", "Schuss von der Strafraumlinie", "Einwurf", "Eckstoß"],
    correctIndex: 1,
    explanation: "Beim Elfmeter wird vom Elfmeterpunkt (11 Meter) direkt auf das Tor geschossen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler ist für seine schnellen Dribblings bekannt und spielt für Frankreich?",
    answers: ["Haaland", "Mbappé", "Neuer", "Kroos"],
    correctIndex: 1,
    explanation: "Kylian Mbappé ist bekannt für seine Schnelligkeit und spielt für Frankreich.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Wie lange dauert ein normales Fußballspiel (ohne Verlängerung)?",
    answers: ["60 Minuten", "80 Minuten", "90 Minuten", "120 Minuten"],
    correctIndex: 2,
    explanation: "Ein normales Fußballspiel dauert 90 Minuten (zwei Halbzeiten à 45 Minuten).",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Farbe hat ein normaler Fußball meistens?",
    answers: ["Rot und Blau", "Schwarz und Weiß", "Grün und Gelb", "Orange und Lila"],
    correctIndex: 1,
    explanation: "Der klassische Fußball ist schwarz-weiß.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was ist ein Tor im Fußball?",
    answers: ["Wenn der Ball über die Seitenlinie geht", "Wenn der Ball ins Netz geht", "Wenn ein Spieler fällt", "Wenn der Schiedsrichter pfeift"],
    correctIndex: 1,
    explanation: "Ein Tor zählt, wenn der Ball vollständig die Torlinie überquert.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie heißt der Spieler, der das Tor beschützt?",
    answers: ["Stürmer", "Mittelfeldspieler", "Torwart", "Außenverteidiger"],
    correctIndex: 2,
    explanation: "Der Torwart steht im Tor und versucht, Schüsse zu halten.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welches Land hat ein grün-gelbes Trikot und ist berühmt für Fußball?",
    answers: ["Deutschland", "Frankreich", "Brasilien", "England"],
    correctIndex: 2,
    explanation: "Brasilien spielt traditionell in Gelb-Grün und ist ein berühmtes Fußball-Land.",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Was macht der Schiedsrichter im Fußball?",
    answers: ["Er spielt mit", "Er achtet auf die Regeln", "Er verkauft Getränke", "Er trainiert die Mannschaft"],
    correctIndex: 1,
    explanation: "Der Schiedsrichter achtet darauf, dass alle Regeln eingehalten werden.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie viele Halbzeiten hat ein Fußballspiel?",
    answers: ["1", "2", "3", "4"],
    correctIndex: 1,
    explanation: "Ein Fußballspiel hat 2 Halbzeiten à 45 Minuten.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Erling Haaland kommt aus welchem Land?",
    answers: ["Schweden", "Dänemark", "Norwegen", "Finnland"],
    correctIndex: 2,
    explanation: "Erling Haaland kommt aus Norwegen.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was bekommt ein Spieler bei einem leichten Foul?",
    answers: ["Rote Karte", "Gelbe Karte", "Blaue Karte", "Grüne Karte"],
    correctIndex: 1,
    explanation: "Bei einem leichten oder wiederholten Foul gibt es eine Gelbe Karte als Verwarnung.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie nennt man es, wenn ein Spieler drei Tore in einem Spiel schießt?",
    answers: ["Doppelpack", "Hattrick", "Viererpack", "Meisterschuss"],
    correctIndex: 1,
    explanation: "Drei Tore in einem Spiel nennt man einen Hattrick.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Neymar kommt aus welchem Land?",
    answers: ["Argentinien", "Spanien", "Brasilien", "Kolumbien"],
    correctIndex: 2,
    explanation: "Neymar kommt aus Brasilien.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist ein Freistoß?",
    answers: ["Ein Schuss nach einem Foul", "Ein Tor", "Ein Einwurf", "Eine Pause"],
    correctIndex: 0,
    explanation: "Nach einem Foul darf die andere Mannschaft einen Freistoß ausführen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Form hat ein Fußballfeld?",
    answers: ["Rund", "Quadratisch", "Rechteckig", "Dreieckig"],
    correctIndex: 2,
    explanation: "Ein Fußballfeld ist rechteckig.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was tragen Fußballspieler an den Füßen?",
    answers: ["Sandalen", "Fußballschuhe", "Hausschuhe", "Stiefel"],
    correctIndex: 1,
    explanation: "Fußballspieler tragen spezielle Fußballschuhe mit Stollen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie heißt der große Fußball-Wettbewerb für Nationalmannschaften?",
    answers: ["Champions League", "Bundesliga", "Weltmeisterschaft", "Kreisliga"],
    correctIndex: 2,
    explanation: "Die Weltmeisterschaft (WM) ist der größte Wettbewerb für Nationalmannschaften.",
    difficulty: "leicht",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welche Mannschaft trägt ein weißes Trikot und wird 'Die Mannschaft' genannt?",
    answers: ["Frankreich", "Brasilien", "Deutschland", "England"],
    correctIndex: 2,
    explanation: "Die deutsche Nationalmannschaft spielt in Weiß.",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Was ist ein Eckball?",
    answers: ["Ein Schuss von der Ecke des Spielfelds", "Ein Tor aus der Mitte", "Ein Einwurf", "Ein Foul"],
    correctIndex: 0,
    explanation: "Einen Eckball gibt es, wenn der Ball über die Torlinie vom Verteidiger geht.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie viele Tore stehen auf einem Fußballfeld?",
    answers: ["1", "2", "3", "4"],
    correctIndex: 1,
    explanation: "Auf einem Fußballfeld stehen 2 Tore – eines an jeder Seite.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wer ist der Kapitän einer Mannschaft?",
    answers: ["Der Jüngste", "Der Anführer mit der Armbinde", "Der Torwart immer", "Der Trainer"],
    correctIndex: 1,
    explanation: "Der Kapitän trägt eine Armbinde und ist der Anführer auf dem Platz.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Toni Kroos spielte für welches Land?",
    answers: ["Österreich", "Schweiz", "Deutschland", "Niederlande"],
    correctIndex: 2,
    explanation: "Toni Kroos spielte für die deutsche Nationalmannschaft.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist ein Einwurf?",
    answers: ["Ball wird mit den Händen eingeworfen", "Ball wird geschossen", "Ball wird geköpft", "Ball wird gerollt"],
    correctIndex: 0,
    explanation: "Beim Einwurf wirft ein Spieler den Ball mit beiden Händen über den Kopf ins Feld.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Farbe hat der Rasen auf einem Fußballfeld?",
    answers: ["Blau", "Rot", "Grün", "Gelb"],
    correctIndex: 2,
    explanation: "Der Rasen auf dem Fußballfeld ist grün.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie heißt es, wenn kein Tor fällt und es 0:0 steht?",
    answers: ["Sieg", "Unentschieden", "Niederlage", "Verlängerung"],
    correctIndex: 1,
    explanation: "Wenn beide Mannschaften gleich viele Tore haben, ist es ein Unentschieden.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Vinícius Júnior spielt für welches Land?",
    answers: ["Portugal", "Argentinien", "Brasilien", "Spanien"],
    correctIndex: 2,
    explanation: "Vinícius Júnior spielt für Brasilien.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist die Champions League?",
    answers: ["Ein Wettbewerb für die besten Vereine Europas", "Die Weltmeisterschaft", "Ein Trainingscamp", "Eine Schul-Liga"],
    correctIndex: 0,
    explanation: "Die Champions League ist der wichtigste Vereinswettbewerb in Europa.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Wie viele Punkte gibt es für einen Sieg in der Bundesliga?",
    answers: ["1 Punkt", "2 Punkte", "3 Punkte", "4 Punkte"],
    correctIndex: 2,
    explanation: "Für einen Sieg gibt es 3 Punkte in der Bundesliga.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welches Tier ist das Maskottchen vieler Fußballvereine?",
    answers: ["Löwe", "Fisch", "Vogel", "Alle drei können es sein"],
    correctIndex: 3,
    explanation: "Viele verschiedene Tiere können Maskottchen sein – Löwen, Adler und mehr.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Jude Bellingham spielt für welches Land?",
    answers: ["Frankreich", "Spanien", "England", "Deutschland"],
    correctIndex: 2,
    explanation: "Jude Bellingham spielt für England.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was passiert in der Halbzeitpause?",
    answers: ["Das Spiel ist vorbei", "Die Spieler ruhen sich aus", "Es gibt Elfmeter", "Die Mannschaften tauschen Spieler"],
    correctIndex: 1,
    explanation: "In der Halbzeitpause ruhen sich die Spieler aus und der Trainer gibt Tipps.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Nationalmannschaft trägt ein blaues Trikot und heißt 'Les Bleus'?",
    answers: ["Italien", "Frankreich", "Argentinien", "Japan"],
    correctIndex: 1,
    explanation: "Frankreich wird 'Les Bleus' (Die Blauen) genannt.",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Darf der Torwart den Ball mit den Händen fangen?",
    answers: ["Nie", "Nur im Strafraum", "Überall auf dem Feld", "Nur beim Elfmeter"],
    correctIndex: 1,
    explanation: "Der Torwart darf den Ball nur innerhalb seines Strafraums mit den Händen spielen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie nennt man den Bereich direkt vor dem Tor?",
    answers: ["Mittelkreis", "Strafraum", "Eckfahne", "Tribüne"],
    correctIndex: 1,
    explanation: "Der Strafraum ist der markierte Bereich vor dem Tor.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler trägt meistens die Nummer 1?",
    answers: ["Der Stürmer", "Der Mittelfeldspieler", "Der Torwart", "Der Verteidiger"],
    correctIndex: 2,
    explanation: "Die Nummer 1 wird traditionell vom Torwart getragen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was ist ein Kopfball?",
    answers: ["Den Ball mit dem Fuß schießen", "Den Ball mit dem Kopf spielen", "Den Ball werfen", "Den Ball fangen"],
    correctIndex: 1,
    explanation: "Bei einem Kopfball spielt man den Ball mit dem Kopf.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie heißt der berühmte Fußballverein aus Barcelona?",
    answers: ["Real Madrid", "FC Barcelona", "Atlético Madrid", "FC Sevilla"],
    correctIndex: 1,
    explanation: "Der FC Barcelona ist der berühmte Verein aus Barcelona.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Alle wie viele Jahre findet die Fußball-WM statt?",
    answers: ["Jedes Jahr", "Alle 2 Jahre", "Alle 4 Jahre", "Alle 6 Jahre"],
    correctIndex: 2,
    explanation: "Die Fußball-Weltmeisterschaft findet alle 4 Jahre statt.",
    difficulty: "leicht",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was ist ein Dribbling?",
    answers: ["Den Ball am Fuß an Gegnern vorbeiführen", "Den Ball wegschießen", "Den Ball köpfen", "Einen Einwurf machen"],
    correctIndex: 0,
    explanation: "Beim Dribbling führt ein Spieler den Ball eng am Fuß an Gegnern vorbei.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welches Land gewann die WM 2018?",
    answers: ["Kroatien", "Brasilien", "Frankreich", "Deutschland"],
    correctIndex: 2,
    explanation: "Frankreich gewann die WM 2018 in Russland.",
    difficulty: "leicht",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was trägt der Schiedsrichter oft in der Hand?",
    answers: ["Einen Ball", "Eine Pfeife", "Einen Schläger", "Ein Handtuch"],
    correctIndex: 1,
    explanation: "Der Schiedsrichter hat eine Pfeife, um das Spiel zu unterbrechen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie heißt der Kreis in der Mitte des Fußballfelds?",
    answers: ["Strafraum", "Torraum", "Mittelkreis", "Eckbereich"],
    correctIndex: 2,
    explanation: "In der Mitte des Felds ist der Mittelkreis, wo das Spiel beginnt.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wo findet man die meisten Fußballfans während eines Spiels?",
    answers: ["Im Supermarkt", "Im Stadion", "In der Schule", "Im Schwimmbad"],
    correctIndex: 1,
    explanation: "Fußballfans schauen das Spiel im Stadion oder vor dem Fernseher.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher dieser Spieler ist ein berühmter Torjäger aus Norwegen?",
    answers: ["Mbappé", "Bellingham", "Haaland", "Kroos"],
    correctIndex: 2,
    explanation: "Erling Haaland aus Norwegen ist einer der besten Torjäger der Welt.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was bedeutet 'Anstoß'?",
    answers: ["Das Spiel beginnt vom Mittelkreis", "Ein Foul", "Ein Tor", "Eine Auswechslung"],
    correctIndex: 0,
    explanation: "Beim Anstoß beginnt das Spiel oder die zweite Halbzeit vom Mittelkreis.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "In welchem Kontinent liegt Brasilien?",
    answers: ["Europa", "Afrika", "Südamerika", "Asien"],
    correctIndex: 2,
    explanation: "Brasilien liegt in Südamerika.",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Wie viele Schiedsrichter sind normalerweise auf dem Feld?",
    answers: ["1", "2", "3", "4"],
    correctIndex: 0,
    explanation: "Auf dem Feld ist normalerweise 1 Hauptschiedsrichter, plus 2 Assistenten an der Seitenlinie.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was passiert bei zwei Gelben Karten für denselben Spieler?",
    answers: ["Nichts", "Er bekommt eine Rote Karte und muss raus", "Er darf weiterspielen", "Er wird Kapitän"],
    correctIndex: 1,
    explanation: "Zwei Gelbe Karten ergeben Gelb-Rot und der Spieler muss das Feld verlassen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wofür steht 'FC' bei Vereinsnamen?",
    answers: ["Fußball Club", "Freier Club", "Fangen Club", "Fester Club"],
    correctIndex: 0,
    explanation: "FC steht für Fußball Club.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Wie heißt die höchste Fußball-Liga in Deutschland?",
    answers: ["Premier League", "La Liga", "Bundesliga", "Serie A"],
    correctIndex: 2,
    explanation: "Die Bundesliga ist die höchste Fußball-Liga in Deutschland.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Was passiert bei Gleichstand nach 90 Minuten in einem KO-Spiel?",
    answers: ["Das Spiel ist vorbei", "Es gibt Verlängerung", "Es wird gelost", "Beide gewinnen"],
    correctIndex: 1,
    explanation: "Bei KO-Spielen gibt es bei Gleichstand eine Verlängerung (und danach ggf. Elfmeterschießen).",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Robert Lewandowski kommt aus welchem Land?",
    answers: ["Deutschland", "Tschechien", "Polen", "Österreich"],
    correctIndex: 2,
    explanation: "Robert Lewandowski kommt aus Polen.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist ein Pass im Fußball?",
    answers: ["Den Ball zu einem Mitspieler spielen", "Am Gegner vorbeigehen", "Einen Fallrückzieher machen", "Den Ball ins Aus schießen"],
    correctIndex: 0,
    explanation: "Ein Pass bedeutet, den Ball zu einem Mitspieler zu spielen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Mannschaft spielt traditionell in Rot und Weiß gestreift (Dortmunds Rivale)?",
    answers: ["FC Bayern", "Borussia Dortmund", "FC Köln", "FC Bayern"],
    correctIndex: 2,
    explanation: "Der 1. FC Köln spielt in Rot-Weiß, aber auch der FC Bayern in Rot.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Was ist ein Fallrückzieher?",
    answers: ["Rückwärts laufen", "Kopfüber den Ball in der Luft schießen", "Sich hinlegen", "Den Ball verlieren"],
    correctIndex: 1,
    explanation: "Beim Fallrückzieher springt der Spieler und schießt den Ball über Kopf – sehr spektakulär!",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welches ist KEIN echter Fußballverein?",
    answers: ["FC Bayern München", "Real Madrid", "FC Mondschein", "Manchester City"],
    correctIndex: 2,
    explanation: "FC Mondschein gibt es nicht – die anderen drei sind echte, berühmte Vereine.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Was tragen Fußballspieler zum Schutz der Schienbeine?",
    answers: ["Schienbeinschoner", "Knieschützer", "Handschuhe", "Helme"],
    correctIndex: 0,
    explanation: "Schienbeinschoner schützen die Schienbeine vor Tritten.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "In welcher Stadt spielt Real Madrid?",
    answers: ["Barcelona", "Madrid", "London", "Paris"],
    correctIndex: 1,
    explanation: "Real Madrid spielt in der spanischen Hauptstadt Madrid.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Wie nennt man den Trainer einer Fußballmannschaft auch?",
    answers: ["Coach", "Schiedsrichter", "Kapitän", "Fan"],
    correctIndex: 0,
    explanation: "Der Trainer wird auch Coach genannt.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was ist ein Eigentor?",
    answers: ["Ein besonders schönes Tor", "Wenn ein Spieler in sein eigenes Tor trifft", "Ein Tor aus 30 Metern", "Ein Kopfballtor"],
    correctIndex: 1,
    explanation: "Ein Eigentor passiert, wenn ein Spieler versehentlich in sein eigenes Tor trifft.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Lionel Messi hat welche Trikotnummer berühmt gemacht?",
    answers: ["7", "9", "10", "11"],
    correctIndex: 2,
    explanation: "Messi ist berühmt für die Nummer 10.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist die Nachspielzeit?",
    answers: ["Zeit nach dem Spiel", "Extra-Minuten am Ende einer Halbzeit", "Die Halbzeitpause", "Training nach dem Spiel"],
    correctIndex: 1,
    explanation: "Die Nachspielzeit sind Extra-Minuten, die der Schiedsrichter für Unterbrechungen dranhängt.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welches Land trägt orange Trikots?",
    answers: ["Deutschland", "Frankreich", "Niederlande", "Spanien"],
    correctIndex: 2,
    explanation: "Die Niederlande (Holland) spielen traditionell in Orange.",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Was bedeutet 'Auswärtsspiel'?",
    answers: ["Spiel im eigenen Stadion", "Spiel im Stadion des Gegners", "Spiel ohne Fans", "Spiel im Ausland"],
    correctIndex: 1,
    explanation: "Ein Auswärtsspiel findet im Stadion des Gegners statt.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher Kontinent hat die meisten WM-Titel gewonnen?",
    answers: ["Europa", "Südamerika", "Afrika", "Asien"],
    correctIndex: 1,
    explanation: "Südamerika hat mit Brasilien (5), Argentinien (3) und Uruguay (2) die meisten WM-Titel.",
    difficulty: "leicht",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was passiert, wenn der Ball über die Seitenlinie geht?",
    answers: ["Eckstoß", "Elfmeter", "Einwurf", "Freistoß"],
    correctIndex: 2,
    explanation: "Geht der Ball über die Seitenlinie, gibt es einen Einwurf für die andere Mannschaft.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher Verein spielt in Gelb und Schwarz?",
    answers: ["FC Bayern München", "Borussia Dortmund", "Schalke 04", "Hertha BSC"],
    correctIndex: 1,
    explanation: "Borussia Dortmund spielt in Gelb und Schwarz.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Was ist eine Auswechslung?",
    answers: ["Ein Spieler wird durch einen anderen ersetzt", "Ein Tor", "Eine Pause", "Ein Foul"],
    correctIndex: 0,
    explanation: "Bei einer Auswechslung kommt ein frischer Spieler für einen müden Spieler ins Spiel.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Trophäe bekommt der WM-Sieger?",
    answers: ["Einen goldenen Ball", "Den WM-Pokal", "Eine goldene Karte", "Einen goldenen Schuh"],
    correctIndex: 1,
    explanation: "Der WM-Sieger bekommt den berühmten goldenen WM-Pokal.",
    difficulty: "leicht",
    category: "Weltmeisterschaft"
  },
  {
    question: "Wie heißt die Frau oder der Mann, die/der an der Seitenlinie die Fahne hebt?",
    answers: ["Der Trainer", "Der Linienrichter", "Der Torwart", "Der Balljunge"],
    correctIndex: 1,
    explanation: "Der Linienrichter (Schiedsrichter-Assistent) zeigt Abseits und Aus an.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler ist der Torschützenkönig aller Zeiten bei Vereinsspielen?",
    answers: ["Pelé", "Messi", "Ronaldo", "Haaland"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo hält den Rekord für die meisten Tore im Vereinsfußball.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist ein Derby?",
    answers: ["Ein Spiel zwischen Nachbar-Vereinen", "Ein Länderspiel", "Ein Freundschaftsspiel", "Ein Training"],
    correctIndex: 0,
    explanation: "Ein Derby ist ein Spiel zwischen zwei Vereinen aus der gleichen Stadt oder Region.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Was ist eine Flanke?",
    answers: ["Ein hoher Ball von der Seite in den Strafraum", "Ein Schuss aufs Tor", "Ein Einwurf", "Ein Foul"],
    correctIndex: 0,
    explanation: "Eine Flanke ist ein hoher Ball von der Seite in Richtung Strafraum.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie alt war Pelé bei seiner ersten WM?",
    answers: ["15", "17", "19", "21"],
    correctIndex: 1,
    explanation: "Pelé war erst 17 Jahre alt, als er 1958 seine erste WM spielte und gewann!",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "In welchem Land befindet sich das Stadion 'Camp Nou'?",
    answers: ["England", "Deutschland", "Spanien", "Frankreich"],
    correctIndex: 2,
    explanation: "Das Camp Nou ist das Stadion des FC Barcelona in Spanien.",
    difficulty: "leicht",
    category: "Stadien"
  },
  {
    question: "Was ist eine Manndeckung?",
    answers: ["Wenn ein Spieler immer bei einem bestimmten Gegner bleibt", "Wenn alle im Tor stehen", "Wenn niemand verteidigt", "Ein Angriffsspiel"],
    correctIndex: 0,
    explanation: "Bei der Manndeckung folgt ein Verteidiger immer einem bestimmten Gegenspieler.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher dieser Spieler ist Deutscher?",
    answers: ["Mbappé", "Haaland", "Kroos", "Messi"],
    correctIndex: 2,
    explanation: "Toni Kroos ist Deutscher und spielte für die Nationalmannschaft.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist das Ziel beim Fußball?",
    answers: ["Möglichst schnell laufen", "Mehr Tore als der Gegner schießen", "Den Ball möglichst oft passen", "Möglichst viele Fouls machen"],
    correctIndex: 1,
    explanation: "Beim Fußball gewinnt die Mannschaft, die mehr Tore schießt.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie nennt man die Fans, die zusammen singen und anfeuern?",
    answers: ["Ultras/Fans", "Spieler", "Trainer", "Schiedsrichter"],
    correctIndex: 0,
    explanation: "Die Fans und Ultras feuern ihre Mannschaft mit Gesängen an.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Trikotfarbe hat die italienische Nationalmannschaft?",
    answers: ["Rot", "Weiß", "Blau", "Grün"],
    correctIndex: 2,
    explanation: "Italien spielt traditionell in Blau (Azzurri).",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Was passiert beim Elfmeterschießen?",
    answers: ["Jede Mannschaft schießt abwechselnd Elfmeter", "Es wird weitergespielt", "Der Schiedsrichter entscheidet", "Es wird gelost"],
    correctIndex: 0,
    explanation: "Beim Elfmeterschießen schießen beide Mannschaften abwechselnd je 5 Elfmeter.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was ist ein Abstoß?",
    answers: ["Der Torwart schießt den Ball weit weg", "Ein Freistoß", "Ein Einwurf", "Ein Elfmeter"],
    correctIndex: 0,
    explanation: "Beim Abstoß spielt der Torwart den Ball vom Torraum wieder ins Spiel.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Wie nennt man das Netz hinter dem Tor?",
    answers: ["Fangnetz", "Tornetz", "Sicherheitsnetz", "Spinnennetz"],
    correctIndex: 1,
    explanation: "Das Tornetz fängt den Ball nach einem Tor auf.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler ist für sein 'Siuuu' berühmt?",
    answers: ["Messi", "Neymar", "Ronaldo", "Haaland"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo ist für seinen 'Siuuu!'-Jubel weltberühmt.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist die Bundesliga?",
    answers: ["Eine Schule", "Die höchste deutsche Fußball-Liga", "Ein Stadion", "Ein Pokal"],
    correctIndex: 1,
    explanation: "Die Bundesliga ist die höchste Spielklasse im deutschen Fußball.",
    difficulty: "leicht",
    category: "Vereine"
  },
  {
    question: "Wie viele Ecken hat ein Fußballfeld?",
    answers: ["2", "3", "4", "6"],
    correctIndex: 2,
    explanation: "Ein Fußballfeld ist rechteckig und hat 4 Ecken mit Eckfahnen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was macht ein Stürmer?",
    answers: ["Er steht im Tor", "Er versucht Tore zu schießen", "Er pfeift das Spiel", "Er sitzt auf der Bank"],
    correctIndex: 1,
    explanation: "Der Stürmer spielt vorne und versucht, Tore für seine Mannschaft zu erzielen.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Pelé kommt aus welchem Land?",
    answers: ["Argentinien", "Portugal", "Brasilien", "Spanien"],
    correctIndex: 2,
    explanation: "Pelé kommt aus Brasilien und gilt als einer der besten Spieler aller Zeiten.",
    difficulty: "leicht",
    category: "Spieler"
  },
  {
    question: "Was ist ein Foul?",
    answers: ["Ein Tor", "Ein regelwidriges Vergehen", "Ein Pass", "Eine Auswechslung"],
    correctIndex: 1,
    explanation: "Ein Foul ist ein Regelverstoß, z.B. wenn man einen Gegner tritt oder schubst.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welches Land spielt in Rot und gewann die WM 2010?",
    answers: ["Portugal", "Schweiz", "Spanien", "Dänemark"],
    correctIndex: 2,
    explanation: "Spanien spielt in Rot und gewann die WM 2010.",
    difficulty: "leicht",
    category: "Länder"
  },
  {
    question: "Was passiert nach einem Tor?",
    answers: ["Das Spiel ist vorbei", "Anstoß für die andere Mannschaft", "Elfmeter", "Einwurf"],
    correctIndex: 1,
    explanation: "Nach einem Tor gibt es Anstoß für die Mannschaft, die das Tor kassiert hat.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Welche Position spielt zwischen Abwehr und Sturm?",
    answers: ["Torwart", "Mittelfeld", "Verteidiger", "Linienrichter"],
    correctIndex: 1,
    explanation: "Das Mittelfeld verbindet Abwehr und Angriff.",
    difficulty: "leicht",
    category: "Regeln"
  },
  {
    question: "Was ist der DFB-Pokal?",
    answers: ["Ein KO-Wettbewerb in Deutschland", "Die Bundesliga", "Ein Länderspiel", "Die Champions League"],
    correctIndex: 0,
    explanation: "Der DFB-Pokal ist ein KO-Turnier, bei dem alle deutschen Vereine mitspielen können.",
    difficulty: "leicht",
    category: "Vereine"
  },

  // ===================== MITTEL (100 Fragen) =====================
  {
    question: "Welches Land gewann die Fußball-WM 2010?",
    answers: ["Deutschland", "Spanien", "Brasilien", "Niederlande"],
    correctIndex: 1,
    explanation: "Spanien gewann die WM 2010 im Finale gegen die Niederlande.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Für welchen Verein wurde Jude Bellingham bekannt, bevor er zu Real Madrid wechselte?",
    answers: ["Borussia Dortmund", "FC Barcelona", "Chelsea", "Juventus"],
    correctIndex: 0,
    explanation: "Jude Bellingham spielte vor Real Madrid für Borussia Dortmund.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher Spieler hat die meisten Tore in der Champions-League-Geschichte erzielt?",
    answers: ["Lionel Messi", "Cristiano Ronaldo", "Robert Lewandowski", "Raúl"],
    correctIndex: 1,
    explanation: "Cristiano Ronaldo ist der Rekordtorschütze der Champions League.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "Welches Land gewann die Fußball-WM 2014?",
    answers: ["Argentinien", "Brasilien", "Deutschland", "Niederlande"],
    correctIndex: 2,
    explanation: "Deutschland gewann die WM 2014 in Brasilien mit einem 1:0 im Finale gegen Argentinien.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Für welchen Verein spielt Erling Haaland?",
    answers: ["Real Madrid", "FC Bayern München", "Manchester City", "Borussia Dortmund"],
    correctIndex: 2,
    explanation: "Erling Haaland spielt für Manchester City.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie heißt der berühmte Fußballverein aus Dortmund?",
    answers: ["Schalke 04", "Borussia Dortmund", "VfB Stuttgart", "Eintracht Frankfurt"],
    correctIndex: 1,
    explanation: "Borussia Dortmund ist der berühmte Verein mit dem gelben Trikot.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher brasilianische Spieler ist für seine Tricks und sein Lächeln bekannt?",
    answers: ["Vinícius Júnior", "Neymar", "Ronaldinho", "Pelé"],
    correctIndex: 1,
    explanation: "Neymar ist für seine Tricks und seinen fröhlichen Spielstil bekannt.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Was bedeutet 'Abseits' im Fußball?",
    answers: ["Ball im Aus", "Spieler steht hinter der letzten Abwehrlinie", "Foul im Strafraum", "Handspiel"],
    correctIndex: 1,
    explanation: "Abseits bedeutet, dass ein Spieler beim Zuspiel hinter dem letzten Verteidiger steht.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein hat den Spitznamen 'Die Königlichen'?",
    answers: ["FC Barcelona", "Manchester United", "Real Madrid", "Juventus"],
    correctIndex: 2,
    explanation: "Real Madrid wird 'Die Königlichen' (Los Blancos / Los Merengues) genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie oft hat Deutschland die Fußball-WM gewonnen?",
    answers: ["3 Mal", "4 Mal", "5 Mal", "2 Mal"],
    correctIndex: 1,
    explanation: "Deutschland hat die WM 4 Mal gewonnen (1954, 1974, 1990, 2014).",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welcher Verein gewann die Champions League 2023?",
    answers: ["Real Madrid", "Manchester City", "FC Bayern", "Inter Mailand"],
    correctIndex: 1,
    explanation: "Manchester City gewann 2023 erstmals die Champions League.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "In welcher Liga spielt der FC Barcelona?",
    answers: ["Premier League", "Bundesliga", "La Liga", "Serie A"],
    correctIndex: 2,
    explanation: "Der FC Barcelona spielt in der spanischen Liga La Liga.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie viele WM-Titel hat Brasilien?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "Brasilien hat 5 WM-Titel gewonnen – Rekord!",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welcher Spieler wechselte 2023 von Borussia Dortmund zu Real Madrid?",
    answers: ["Haaland", "Bellingham", "Sancho", "Reus"],
    correctIndex: 1,
    explanation: "Jude Bellingham wechselte 2023 von Dortmund zu Real Madrid.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist der 'Goldene Schuh'?",
    answers: ["Ein teurer Fußballschuh", "Preis für den besten Torschützen einer Saison", "Ein Schuh aus Gold", "Ein Vereinsmaskottchen"],
    correctIndex: 1,
    explanation: "Der Goldene Schuh geht an den besten Torschützen in Europas Ligen.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "Wie heißt das berühmte Stadion von Borussia Dortmund?",
    answers: ["Allianz Arena", "Signal Iduna Park", "Olympiastadion", "Volksparkstadion"],
    correctIndex: 1,
    explanation: "Das Stadion von Borussia Dortmund heißt Signal Iduna Park (Westfalenstadion).",
    difficulty: "mittel",
    category: "Stadien"
  },
  {
    question: "Welcher Verein hat die meisten Champions-League-Titel?",
    answers: ["FC Barcelona", "AC Mailand", "Real Madrid", "FC Bayern München"],
    correctIndex: 2,
    explanation: "Real Madrid hat mit 15 Titeln die meisten Champions-League-Siege.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wer war WM-Torschützenkönig 2022?",
    answers: ["Messi", "Mbappé", "Giroud", "Álvarez"],
    correctIndex: 1,
    explanation: "Kylian Mbappé wurde 2022 Torschützenkönig mit 8 Toren.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "In welchem Land spielt die Premier League?",
    answers: ["Spanien", "Deutschland", "England", "Frankreich"],
    correctIndex: 2,
    explanation: "Die Premier League ist die höchste Liga in England.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie heißt das Stadion von FC Bayern München?",
    answers: ["Signal Iduna Park", "Allianz Arena", "Wembley", "Bernabéu"],
    correctIndex: 1,
    explanation: "Der FC Bayern München spielt in der Allianz Arena.",
    difficulty: "mittel",
    category: "Stadien"
  },
  {
    question: "Welcher Torwart hielt den Rekord für die meisten Spiele ohne Gegentor in der Bundesliga?",
    answers: ["Oliver Kahn", "Manuel Neuer", "Marc-André ter Stegen", "Jens Lehmann"],
    correctIndex: 1,
    explanation: "Manuel Neuer hält viele Rekorde als Torwart in der Bundesliga.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "Welches Land hat die Europameisterschaft 2020 (gespielt 2021) gewonnen?",
    answers: ["England", "Italien", "Spanien", "Frankreich"],
    correctIndex: 1,
    explanation: "Italien gewann die EM 2020/2021 im Finale gegen England.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Vinícius Júnior spielt für welchen Verein?",
    answers: ["FC Barcelona", "Manchester City", "PSG", "Real Madrid"],
    correctIndex: 3,
    explanation: "Vinícius Júnior spielt für Real Madrid.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein Volley?",
    answers: ["Den Ball aus der Luft schießen ohne Bodenkontakt", "Ein Kopfball", "Ein Freistoß", "Ein langer Pass"],
    correctIndex: 0,
    explanation: "Ein Volley ist ein Schuss, bei dem der Ball direkt aus der Luft getroffen wird.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher deutsche Spieler erzielte das WM-Finaltor 2014?",
    answers: ["Thomas Müller", "Mario Götze", "Miroslav Klose", "Mesut Özil"],
    correctIndex: 1,
    explanation: "Mario Götze schoss das entscheidende Tor im WM-Finale 2014.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Wie heißt der Wettbewerb für Nationalmannschaften in Europa?",
    answers: ["Champions League", "Europa League", "Europameisterschaft", "Conference League"],
    correctIndex: 2,
    explanation: "Die Europameisterschaft (EM) ist der Wettbewerb für europäische Nationalmannschaften.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welcher Spieler hat den Spitznamen 'CR7'?",
    answers: ["Messi", "Ronaldo", "Neymar", "Mbappé"],
    correctIndex: 1,
    explanation: "CR7 steht für Cristiano Ronaldo und seine berühmte Nummer 7.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Für welchen Verein spielte Toni Kroos zuletzt?",
    answers: ["FC Bayern München", "Manchester United", "Real Madrid", "Borussia Dortmund"],
    correctIndex: 2,
    explanation: "Toni Kroos beendete seine Karriere bei Real Madrid.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist die Europa League?",
    answers: ["Der zweitwichtigste europäische Vereinswettbewerb", "Eine Liga in Europa", "Die Bundesliga", "Ein Freundschaftsturnier"],
    correctIndex: 0,
    explanation: "Die Europa League ist nach der Champions League der zweitwichtigste Vereinswettbewerb.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher Spieler wurde 'Der Kaiser' genannt?",
    answers: ["Gerd Müller", "Franz Beckenbauer", "Lothar Matthäus", "Karl-Heinz Rummenigge"],
    correctIndex: 1,
    explanation: "Franz Beckenbauer wurde 'Der Kaiser' genannt – einer der größten deutschen Spieler.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Wie viele Auswechslungen sind in einem normalen Spiel erlaubt?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "Seit 2020 sind 5 Auswechslungen pro Spiel erlaubt.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welches Land gewann die EM 2024?",
    answers: ["Deutschland", "Spanien", "England", "Frankreich"],
    correctIndex: 1,
    explanation: "Spanien gewann die Europameisterschaft 2024 in Deutschland.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was ist der VAR?",
    answers: ["Video-Assistent für Schiedsrichter", "Ein Spieler", "Eine Taktik", "Ein Stadion"],
    correctIndex: 0,
    explanation: "VAR steht für Video Assistant Referee – der Video-Schiedsrichter überprüft strittige Szenen.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein hat den Spitznamen 'Die Borussen'?",
    answers: ["FC Bayern", "Schalke 04", "Borussia Dortmund", "Hertha BSC"],
    correctIndex: 2,
    explanation: "Borussia Dortmund wird 'Die Borussen' genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein 'Doppelpass'?",
    answers: ["Zwei Spieler passen sich schnell den Ball zu", "Zwei Tore nacheinander", "Ein doppelter Einwurf", "Zwei Gelbe Karten"],
    correctIndex: 0,
    explanation: "Beim Doppelpass spielen sich zwei Spieler den Ball schnell hin und her.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Wie heißt Messis Spitzname?",
    answers: ["Der König", "Der Floh", "Die Rakete", "Der Magier"],
    correctIndex: 1,
    explanation: "Messi wird 'La Pulga' (Der Floh) genannt, weil er klein und wendig ist.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Welcher Verein spielt im 'Old Trafford'?",
    answers: ["Manchester City", "Liverpool", "Manchester United", "Chelsea"],
    correctIndex: 2,
    explanation: "Manchester United spielt im Old Trafford, dem 'Theater der Träume'.",
    difficulty: "mittel",
    category: "Stadien"
  },
  {
    question: "Was ist eine 'Viererkette'?",
    answers: ["4 Stürmer", "4 Verteidiger in einer Reihe", "4 Mittelfeldspieler", "4 Tore"],
    correctIndex: 1,
    explanation: "Die Viererkette ist eine Abwehrformation mit 4 Verteidigern.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler wechselte für über 200 Millionen Euro zu PSG?",
    answers: ["Mbappé", "Neymar", "Messi", "Ronaldo"],
    correctIndex: 1,
    explanation: "Neymar wechselte 2017 für 222 Millionen Euro von Barcelona zu PSG – Rekord!",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "In welchem Stadion wird das Champions-League-Finale oft gespielt?",
    answers: ["Allianz Arena", "Wembley", "Camp Nou", "Anfield"],
    correctIndex: 1,
    explanation: "Das Wembley-Stadion in London ist ein häufiger Austragungsort für große Finale.",
    difficulty: "mittel",
    category: "Stadien"
  },
  {
    question: "Welches Land hat die meisten EM-Titel?",
    answers: ["Deutschland", "Spanien", "Frankreich", "Deutschland und Spanien gleich"],
    correctIndex: 3,
    explanation: "Deutschland und Spanien haben je 3 EM-Titel gewonnen.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was bedeutet 'Pressing'?",
    answers: ["Den Gegner überall auf dem Feld unter Druck setzen", "Den Ball pressen", "Langsam spielen", "Nur verteidigen"],
    correctIndex: 0,
    explanation: "Beim Pressing setzt die Mannschaft den Gegner früh unter Druck, um den Ball zu gewinnen.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein wird 'Die Roten' genannt?",
    answers: ["Borussia Dortmund", "FC Bayern München", "Schalke 04", "Wolfsburg"],
    correctIndex: 1,
    explanation: "Der FC Bayern München wird wegen seiner roten Trikots 'Die Roten' genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wer wurde 2022 mit Argentinien Weltmeister?",
    answers: ["Ronaldo", "Neymar", "Messi", "Haaland"],
    correctIndex: 2,
    explanation: "Lionel Messi gewann 2022 mit Argentinien endlich die Weltmeisterschaft.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was ist ein 'Konter'?",
    answers: ["Ein schneller Gegenangriff", "Ein Foul", "Ein Abschlag", "Eine Verteidigung"],
    correctIndex: 0,
    explanation: "Ein Konter ist ein schneller Gegenangriff nach Ballgewinn.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher deutsche Spieler hält den WM-Torrekord?",
    answers: ["Gerd Müller", "Thomas Müller", "Miroslav Klose", "Jürgen Klinsmann"],
    correctIndex: 2,
    explanation: "Miroslav Klose ist mit 16 WM-Toren der Rekordtorschütze der WM-Geschichte.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "In welcher Stadt spielt Sturm Graz?",
    answers: ["Wien", "Salzburg", "Graz", "Innsbruck"],
    correctIndex: 2,
    explanation: "Sturm Graz spielt in Graz, der zweitgrößten Stadt Österreichs.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist eine 'Schwalbe'?",
    answers: ["Ein Vogel im Stadion", "Sich fallen lassen, um einen Freistoß zu bekommen", "Ein besonderer Schuss", "Ein schneller Sprint"],
    correctIndex: 1,
    explanation: "Eine Schwalbe ist, wenn ein Spieler ein Foul vortäuscht – das ist unsportlich!",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein hat den Spitznamen 'Barça'?",
    answers: ["Real Madrid", "FC Barcelona", "Atlético Madrid", "FC Sevilla"],
    correctIndex: 1,
    explanation: "FC Barcelona wird oft kurz 'Barça' genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie viele Spieler sitzen normalerweise auf der Ersatzbank?",
    answers: ["3-5", "5-7", "7-12", "15-20"],
    correctIndex: 2,
    explanation: "Auf der Ersatzbank sitzen normalerweise zwischen 7 und 12 Spieler.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Wer trainierte den FC Bayern München am längsten?",
    answers: ["Pep Guardiola", "Jupp Heynckes", "Udo Lattek", "Ottmar Hitzfeld"],
    correctIndex: 2,
    explanation: "Udo Lattek trainierte den FC Bayern in drei verschiedenen Amtszeiten am längsten.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist der 'Ballon d'Or'?",
    answers: ["Ein goldener Ball zum Spielen", "Der Preis für den besten Spieler der Welt", "Ein Stadion", "Ein Vereinsname"],
    correctIndex: 1,
    explanation: "Der Ballon d'Or ist die Auszeichnung für den weltbesten Fußballer des Jahres.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "Welcher Verein gewann 2020 die Champions League im leeren Stadion?",
    answers: ["Real Madrid", "FC Bayern München", "PSG", "Manchester City"],
    correctIndex: 1,
    explanation: "FC Bayern München gewann 2020 die Champions League – wegen Corona ohne Zuschauer.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie heißt der GAK mit vollem Namen?",
    answers: ["Grazer Allgemein-Klub", "Grazer Athletik-Klub", "Grazer Athletiksport-Klub", "Grazer Aktiv-Klub"],
    correctIndex: 2,
    explanation: "GAK steht für Grazer Athletiksport-Klub.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist 'Tiki-Taka'?",
    answers: ["Ein Spieler", "Ein Kurzpass-Spielstil", "Ein Stadion", "Ein Tanz"],
    correctIndex: 1,
    explanation: "Tiki-Taka ist ein Spielstil mit vielen kurzen Pässen, berühmt gemacht durch Spanien und Barcelona.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welches Team holte 2013 das Triple (Meisterschaft, Pokal, Champions League)?",
    answers: ["Real Madrid", "FC Barcelona", "FC Bayern München", "Manchester United"],
    correctIndex: 2,
    explanation: "Der FC Bayern München gewann 2013 das Triple unter Jupp Heynckes.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie heißt der Torjubel, bei dem Ronaldo in die Luft springt und sich dreht?",
    answers: ["Siuuu", "Dab", "Moonwalk", "Robot"],
    correctIndex: 0,
    explanation: "Ronaldos berühmter Jubel mit dem Ruf 'Siuuu!' ist weltweit bekannt.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Welches Land gewann die Fußball-WM 2006?",
    answers: ["Deutschland", "Frankreich", "Italien", "Brasilien"],
    correctIndex: 2,
    explanation: "Italien gewann die WM 2006 in Deutschland im Elfmeterschießen gegen Frankreich.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was ist ein 'Tunnel' (Panna) im Fußball?",
    answers: ["Ein Gang unter dem Stadion", "Den Ball durch die Beine des Gegners spielen", "Ein langer Pass", "Ein Tor von weit weg"],
    correctIndex: 1,
    explanation: "Ein Tunnel bedeutet, den Ball durch die Beine eines Gegners zu spielen.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Wie heißt die Liga in Italien?",
    answers: ["La Liga", "Bundesliga", "Serie A", "Ligue 1"],
    correctIndex: 2,
    explanation: "Die höchste italienische Liga heißt Serie A.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher Trainer machte Manchester City zum Champions-League-Sieger?",
    answers: ["Jürgen Klopp", "Pep Guardiola", "Carlo Ancelotti", "José Mourinho"],
    correctIndex: 1,
    explanation: "Pep Guardiola führte Manchester City 2023 zum Champions-League-Titel.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein 'Lupfer'?",
    answers: ["Ein Schuss mit der Ferse", "Den Ball über den Torwart heben", "Ein Kopfball", "Ein Einwurf"],
    correctIndex: 1,
    explanation: "Ein Lupfer ist ein gefühlvoller Schuss, der den Ball über den Torwart hebt.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher österreichische Verein hat die meisten Meistertitel?",
    answers: ["Sturm Graz", "Red Bull Salzburg", "Rapid Wien", "Austria Wien"],
    correctIndex: 2,
    explanation: "Rapid Wien hat die meisten österreichischen Meistertitel.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wofür ist Lionel Messi besonders bekannt?",
    answers: ["Kopfbälle", "Dribblings und Tore", "Grätsche", "Torwart-Paraden"],
    correctIndex: 1,
    explanation: "Messi ist weltberühmt für seine genialen Dribblings und seine vielen Tore.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "In welchem Stadion spielt die englische Nationalmannschaft?",
    answers: ["Old Trafford", "Anfield", "Wembley", "Emirates Stadium"],
    correctIndex: 2,
    explanation: "Die englische Nationalmannschaft spielt im Wembley-Stadion in London.",
    difficulty: "mittel",
    category: "Stadien"
  },
  {
    question: "Was ist ein 'Rabona'?",
    answers: ["Ein Schuss hinter dem Standbein", "Ein Kopfball", "Ein Einwurf", "Ein Tackling"],
    correctIndex: 0,
    explanation: "Bei einem Rabona schießt der Spieler hinter dem Standbein vorbei – sehr kunstvoll!",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler wird 'El Bicho' genannt?",
    answers: ["Messi", "Neymar", "Ronaldo", "Mbappé"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo wird von seinen Fans 'El Bicho' (Das Tier) genannt.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Wie heißt die französische Liga?",
    answers: ["Serie A", "La Liga", "Premier League", "Ligue 1"],
    correctIndex: 3,
    explanation: "Die höchste französische Liga heißt Ligue 1.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein 'Traumtor'?",
    answers: ["Ein Tor im Traum", "Ein besonders schönes, spektakuläres Tor", "Das erste Tor eines Spielers", "Ein Tor in der Nachspielzeit"],
    correctIndex: 1,
    explanation: "Ein Traumtor ist ein besonders schönes, sehenswertes Tor.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein hat das Motto 'Más que un club' (Mehr als ein Verein)?",
    answers: ["Real Madrid", "FC Barcelona", "Atlético Madrid", "Manchester United"],
    correctIndex: 1,
    explanation: "FC Barcelona hat das berühmte Motto 'Més que un club' – Mehr als ein Verein.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie nennt man es, wenn ein Spieler den Ball ohne Bodenkontakt annimmt?",
    answers: ["Direktannahme", "Volley", "Ballannahme aus der Luft", "Lupfer"],
    correctIndex: 0,
    explanation: "Die Direktannahme ist, wenn ein Spieler den Ball kontrolliert, ohne dass er den Boden berührt.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler hat sowohl für Real Madrid als auch für Juventus gespielt?",
    answers: ["Messi", "Ronaldo", "Neymar", "Mbappé"],
    correctIndex: 1,
    explanation: "Cristiano Ronaldo spielte für beide Vereine – Real Madrid und Juventus Turin.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Was ist die 'Mauer' bei einem Freistoß?",
    answers: ["Eine echte Mauer", "Spieler stehen als Schutzwand zusammen", "Der Torwart", "Die Werbebanden"],
    correctIndex: 1,
    explanation: "Bei einem Freistoß stellen sich Spieler als 'Mauer' vor das Tor zum Schutz.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welches Team gewann 6 Champions-League-Titel in Folge von 1956-1960?",
    answers: ["AC Mailand", "FC Barcelona", "Real Madrid", "Benfica"],
    correctIndex: 2,
    explanation: "Real Madrid gewann die ersten 5 Ausgaben des Europapokals (1956-1960) in Folge.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher Spieler ist bekannt für seine Freistöße und spielte für Manchester United?",
    answers: ["Rooney", "Beckham", "Scholes", "Giggs"],
    correctIndex: 1,
    explanation: "David Beckham war berühmt für seine perfekten Freistöße.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Was ist ein 'Joker' im Fußball?",
    answers: ["Ein lustiger Spieler", "Ein eingewechselter Spieler, der das Spiel dreht", "Der Schiedsrichter", "Der Kapitän"],
    correctIndex: 1,
    explanation: "Ein Joker ist ein Einwechselspieler, der von der Bank kommt und das Spiel entscheidet.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welche Stadt hat die Vereine Inter und AC Mailand?",
    answers: ["Rom", "Turin", "Mailand", "Neapel"],
    correctIndex: 2,
    explanation: "Beide Vereine kommen aus Mailand und teilen sich sogar das gleiche Stadion.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welches Land stellte bei der WM 2022 den jüngsten Torschützen?",
    answers: ["England", "Spanien", "Frankreich", "Deutschland"],
    correctIndex: 0,
    explanation: "Englands junge Spieler waren bei der WM 2022 sehr erfolgreich.",
    difficulty: "mittel",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welcher Verein spielt im 'Anfield'?",
    answers: ["Manchester United", "Chelsea", "Liverpool", "Tottenham"],
    correctIndex: 2,
    explanation: "Liverpool spielt im berühmten Anfield-Stadion.",
    difficulty: "mittel",
    category: "Stadien"
  },
  {
    question: "Wie heißt der Spitzname von Borussia Mönchengladbach?",
    answers: ["Die Fohlen", "Die Borussen", "Die Löwen", "Die Adler"],
    correctIndex: 0,
    explanation: "Borussia Mönchengladbach wird 'Die Fohlen' genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher Verein hat den Spitznamen 'Die Werkself'?",
    answers: ["VfL Wolfsburg", "Bayer Leverkusen", "RB Leipzig", "TSG Hoffenheim"],
    correctIndex: 1,
    explanation: "Bayer Leverkusen wird wegen der Verbindung zum Bayer-Konzern 'Die Werkself' genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welcher Spieler gewann 2024 den Ballon d'Or?",
    answers: ["Messi", "Haaland", "Vinícius Júnior", "Bellingham"],
    correctIndex: 2,
    explanation: "Vinícius Júnior gewann 2024 den Ballon d'Or nach einer starken Saison mit Real Madrid.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "Was ist eine 'Grätsche'?",
    answers: ["Ein Schuss", "Ein Tackling mit gestrecktem Bein am Boden", "Ein Kopfball", "Ein Einwurf"],
    correctIndex: 1,
    explanation: "Bei einer Grätsche rutscht der Verteidiger am Boden, um den Ball zu erobern.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein gewann 2024 die Champions League?",
    answers: ["Manchester City", "Real Madrid", "Bayern München", "Borussia Dortmund"],
    correctIndex: 1,
    explanation: "Real Madrid gewann 2024 die Champions League im Finale gegen Borussia Dortmund.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist der 'Goldene Handschuh'?",
    answers: ["Ein Preis für den besten Torwart", "Ein teurer Handschuh", "Eine Gelbe Karte", "Ein Vereinsname"],
    correctIndex: 0,
    explanation: "Der Goldene Handschuh geht an den besten Torwart eines Turniers.",
    difficulty: "mittel",
    category: "Rekorde"
  },
  {
    question: "Welches Team hat den Spitznamen 'Galaktische'?",
    answers: ["FC Barcelona", "PSG", "Real Madrid", "Manchester City"],
    correctIndex: 2,
    explanation: "Real Madrid wurde Anfang der 2000er 'Los Galácticos' genannt, weil sie so viele Stars kauften.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Wie heißt die österreichische Bundesliga?",
    answers: ["Erste Liga", "Admiral Bundesliga", "Super League", "Austrian League"],
    correctIndex: 1,
    explanation: "Die höchste österreichische Liga heißt Admiral Bundesliga (nach dem Sponsor).",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was bedeutet 'Kontertaktik'?",
    answers: ["Nur angreifen", "Tief stehen und bei Ballgewinn schnell umschalten", "Nur den Ball halten", "Immer Elfmeter schießen"],
    correctIndex: 1,
    explanation: "Bei der Kontertaktik lässt man den Gegner kommen und schlägt bei Ballgewinn schnell zu.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein kommt aus Turin und spielt in Schwarz-Weiß?",
    answers: ["AC Mailand", "Inter Mailand", "Juventus Turin", "AS Rom"],
    correctIndex: 2,
    explanation: "Juventus Turin spielt traditionell in Schwarz-Weiß gestreift.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein 'Sechser' im Fußball?",
    answers: ["Ein defensiver Mittelfeldspieler", "Ein Spieler mit der Nummer 6", "Ein Stürmer", "Ein Schiedsrichter"],
    correctIndex: 0,
    explanation: "Der 'Sechser' ist der defensive Mittelfeldspieler, der vor der Abwehr spielt.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Trainer wurde mit Liverpool und Dortmund bekannt?",
    answers: ["Pep Guardiola", "Carlo Ancelotti", "Jürgen Klopp", "Thomas Tuchel"],
    correctIndex: 2,
    explanation: "Jürgen Klopp war sehr erfolgreich mit Borussia Dortmund und dem FC Liverpool.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein 'Libero'?",
    answers: ["Ein freier Verteidiger hinter der Abwehrkette", "Ein Stürmer", "Ein Torwart", "Ein Flügelspieler"],
    correctIndex: 0,
    explanation: "Der Libero spielt als freier Mann hinter der Abwehrreihe – heute selten geworden.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Verein wurde 2023 erstmals Deutscher Meister?",
    answers: ["Union Berlin", "Bayer Leverkusen", "RB Leipzig", "Eintracht Frankfurt"],
    correctIndex: 1,
    explanation: "Bayer Leverkusen wurde 2023/24 erstmals Deutscher Meister – sogar ungeschlagen!",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist die 'Nachspielzeit' auch genannt?",
    answers: ["Overtime", "Injury Time", "Pause", "Halbzeit"],
    correctIndex: 1,
    explanation: "Die Nachspielzeit heißt auf Englisch 'Injury Time' (Verletzungszeit).",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler ist für den 'Elastico'-Trick berühmt?",
    answers: ["Messi", "Ronaldinho", "Zidane", "Beckham"],
    correctIndex: 1,
    explanation: "Ronaldinho machte den Elastico-Trick weltberühmt – ein schneller Richtungswechsel mit dem Ball.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Wie heißt der wichtigste Pokalwettbewerb in England?",
    answers: ["League Cup", "FA Cup", "Community Shield", "EFL Trophy"],
    correctIndex: 1,
    explanation: "Der FA Cup ist der älteste und wichtigste Pokalwettbewerb in England.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Welche Mannschaft wird 'Die Elf vom Niederrhein' genannt?",
    answers: ["FC Köln", "Fortuna Düsseldorf", "Borussia Mönchengladbach", "MSV Duisburg"],
    correctIndex: 2,
    explanation: "Borussia Mönchengladbach wird auch 'Die Elf vom Niederrhein' genannt.",
    difficulty: "mittel",
    category: "Vereine"
  },
  {
    question: "Was ist ein 'Abstieg'?",
    answers: ["Wenn eine Mannschaft in eine niedrigere Liga muss", "Ein Spieler verlässt den Platz", "Ein Trainerwechsel", "Eine Pause"],
    correctIndex: 0,
    explanation: "Abstieg bedeutet, dass ein Verein am Saisonende in eine niedrigere Liga muss.",
    difficulty: "mittel",
    category: "Regeln"
  },
  {
    question: "Welcher Spieler hat den Spitznamen 'Die Biene'?",
    answers: ["Marco Reus", "Florian Wirtz", "Thomas Müller", "Jamal Musiala"],
    correctIndex: 2,
    explanation: "Thomas Müller wird wegen seines Spielstils manchmal 'Die Biene' oder 'Raumdeuter' genannt.",
    difficulty: "mittel",
    category: "Spieler"
  },
  {
    question: "Welcher Verein hat das Motto 'Hala Madrid'?",
    answers: ["Atlético Madrid", "Real Madrid", "FC Barcelona", "FC Sevilla"],
    correctIndex: 1,
    explanation: "Die Fans von Real Madrid rufen 'Hala Madrid!' – das bedeutet 'Vorwärts Madrid!'.",
    difficulty: "mittel",
    category: "Vereine"
  },

  // ===================== SCHWER (100 Fragen) =====================
  {
    question: "Welches Land gewann die erste Fußball-WM 1930?",
    answers: ["Brasilien", "Uruguay", "Argentinien", "Italien"],
    correctIndex: 1,
    explanation: "Uruguay gewann 1930 die erste Fußball-WM im eigenen Land.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "In welchem Jahr gewann Pelé seine erste Weltmeisterschaft?",
    answers: ["1954", "1958", "1962", "1966"],
    correctIndex: 1,
    explanation: "Pelé gewann seine erste WM 1958 in Schweden – mit nur 17 Jahren!",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein gewann die erste Champions-League (damals Europapokal der Landesmeister) 1956?",
    answers: ["AC Mailand", "Real Madrid", "Benfica", "FC Barcelona"],
    correctIndex: 1,
    explanation: "Real Madrid gewann den ersten Europapokal der Landesmeister 1956.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie hieß das legendäre 'Wunder von Bern' und in welchem Jahr war es?",
    answers: ["WM-Finale 1950", "WM-Finale 1954", "WM-Finale 1958", "WM-Finale 1962"],
    correctIndex: 1,
    explanation: "Das 'Wunder von Bern' war das WM-Finale 1954, als Deutschland Ungarn 3:2 besiegte.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte bei der WM 2002 den Siegtreffer im Finale für Brasilien?",
    answers: ["Ronaldinho", "Ronaldo", "Rivaldo", "Roberto Carlos"],
    correctIndex: 1,
    explanation: "Ronaldo (der brasilianische) erzielte im WM-Finale 2002 zwei Tore gegen Deutschland.",
    difficulty: "schwer",
    category: "Weltmeisterschaft"
  },
  {
    question: "Wie viele Ballon d'Or (Goldene Bälle) hat Lionel Messi gewonnen?",
    answers: ["6", "7", "8", "5"],
    correctIndex: 2,
    explanation: "Lionel Messi hat 8 Ballon d'Or gewonnen – Rekord!",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welches Land hat die meisten Fußball-Weltmeisterschaften gewonnen?",
    answers: ["Deutschland", "Italien", "Argentinien", "Brasilien"],
    correctIndex: 3,
    explanation: "Brasilien hat mit 5 Titeln (1958, 1962, 1970, 1994, 2002) die meisten WM-Siege.",
    difficulty: "schwer",
    category: "Weltmeisterschaft"
  },
  {
    question: "In welchem Jahr wurde die deutsche Bundesliga gegründet?",
    answers: ["1957", "1960", "1963", "1970"],
    correctIndex: 2,
    explanation: "Die Bundesliga wurde 1963 gegründet. Die erste Saison war 1963/64.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher österreichische Verein hat seinen Sitz in Graz und trägt Schwarz-Weiß?",
    answers: ["Rapid Wien", "Sturm Graz", "Austria Wien", "Red Bull Salzburg"],
    correctIndex: 1,
    explanation: "Sturm Graz ist der Verein aus Graz mit den schwarz-weißen Farben.",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "Wer war der erste Spieler, der in fünf verschiedenen WM-Turnieren ein Tor erzielte?",
    answers: ["Pelé", "Miroslav Klose", "Cristiano Ronaldo", "Lionel Messi"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo traf bei den WMs 2006, 2010, 2014, 2018 und 2022.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "In welchem Jahr wurde die FIFA gegründet?",
    answers: ["1900", "1904", "1910", "1920"],
    correctIndex: 1,
    explanation: "Die FIFA wurde 1904 in Paris gegründet.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land gewann die WM 1970 mit dem 'schönsten Team aller Zeiten'?",
    answers: ["Argentinien", "Deutschland", "Brasilien", "Italien"],
    correctIndex: 2,
    explanation: "Brasilien gewann 1970 mit Pelé, Jairzinho und Carlos Alberto – oft als schönstes Team aller Zeiten bezeichnet.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wer erzielte das 'Tor des Jahrhunderts' bei der WM 1986?",
    answers: ["Pelé", "Maradona", "Zidane", "Beckenbauer"],
    correctIndex: 1,
    explanation: "Diego Maradona erzielte 1986 das 'Tor des Jahrhunderts' gegen England mit einem Solo über das halbe Feld.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Stadion fasst die meisten Zuschauer weltweit?",
    answers: ["Camp Nou", "Wembley", "Rungrado May Day Stadium (Nordkorea)", "Maracanã"],
    correctIndex: 2,
    explanation: "Das Rungrado May Day Stadium in Nordkorea fasst über 114.000 Zuschauer.",
    difficulty: "schwer",
    category: "Stadien"
  },
  {
    question: "In welchem Jahr gewann Deutschland die WM durch das 'Wunder von Bern'?",
    answers: ["1950", "1954", "1958", "1962"],
    correctIndex: 1,
    explanation: "1954 gewann Deutschland überraschend die WM in der Schweiz.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie hieß die 'Hand Gottes' und wer war beteiligt?",
    answers: ["Pelé 1970", "Maradona 1986", "Zidane 2006", "Messi 2014"],
    correctIndex: 1,
    explanation: "Maradona erzielte 1986 ein Tor mit der Hand gegen England und nannte es die 'Hand Gottes'.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein gewann 1999 das Triple mit einem dramatischen Champions-League-Finale?",
    answers: ["FC Bayern München", "Manchester United", "Real Madrid", "Juventus"],
    correctIndex: 1,
    explanation: "Manchester United gewann 1999 das Finale in der Nachspielzeit gegen Bayern München.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele WM-Tore hat Miroslav Klose insgesamt erzielt?",
    answers: ["14", "15", "16", "17"],
    correctIndex: 2,
    explanation: "Miroslav Klose erzielte 16 WM-Tore und ist damit alleiniger Rekordhalter.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "In welchem Jahr fand die erste Europameisterschaft statt?",
    answers: ["1956", "1958", "1960", "1964"],
    correctIndex: 2,
    explanation: "Die erste Europameisterschaft fand 1960 in Frankreich statt. Die Sowjetunion gewann.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler wurde bei der WM 2006 im Finale mit einer Roten Karte bestraft?",
    answers: ["Zidane", "Materazzi", "Buffon", "Henry"],
    correctIndex: 0,
    explanation: "Zinédine Zidane bekam Rot für seinen Kopfstoß gegen Materazzi im WM-Finale 2006.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land gewann die WM 1966?",
    answers: ["Deutschland", "Brasilien", "England", "Argentinien"],
    correctIndex: 2,
    explanation: "England gewann die WM 1966 im eigenen Land – der bisher einzige WM-Titel Englands.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie hieß der legendäre ungarische Spieler, der in den 1950ern als bester der Welt galt?",
    answers: ["Puskás", "Kocsis", "Hidegkuti", "Czibor"],
    correctIndex: 0,
    explanation: "Ferenc Puskás war in den 1950ern einer der besten Spieler aller Zeiten.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "In welchem Jahr gewann der FC Bayern München seinen ersten Europapokal?",
    answers: ["1972", "1974", "1975", "1976"],
    correctIndex: 2,
    explanation: "Der FC Bayern gewann 1974 seinen ersten Europapokal der Landesmeister (Finale: April 1975, Wiederholung).",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler hält den Rekord für die meisten Tore in einem Kalenderjahr?",
    answers: ["Cristiano Ronaldo (69)", "Lionel Messi (91)", "Gerd Müller (85)", "Pelé (75)"],
    correctIndex: 1,
    explanation: "Lionel Messi erzielte 2012 unglaubliche 91 Tore in einem Kalenderjahr.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welches Land verlor das WM-Finale 1950 überraschend gegen Uruguay?",
    answers: ["Argentinien", "Brasilien", "Schweden", "Spanien"],
    correctIndex: 1,
    explanation: "Brasilien verlor 1950 überraschend das 'Finale' (Entscheidungsspiel) gegen Uruguay im Maracanã.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele Ballon d'Or hat Cristiano Ronaldo gewonnen?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo hat 5 Ballon d'Or gewonnen (2008, 2013, 2014, 2016, 2017).",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welches Spiel wird als 'Schmach von Córdoba' bezeichnet?",
    answers: ["Deutschland - Österreich WM 1978", "Brasilien - Deutschland WM 2014", "Ungarn - Deutschland WM 1954", "England - Island EM 2016"],
    correctIndex: 0,
    explanation: "Österreich besiegte Deutschland 1978 bei der WM in Córdoba 3:2 – eine 'Schmach' für Deutschland.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wer war der jüngste WM-Torschütze aller Zeiten?",
    answers: ["Mbappé", "Pelé", "Owen", "Messi"],
    correctIndex: 1,
    explanation: "Pelé war 17 Jahre und 239 Tage alt bei seinem ersten WM-Tor 1958.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "In welchem Jahr wurde das Elfmeterschießen bei der WM eingeführt?",
    answers: ["1970", "1974", "1978", "1982"],
    correctIndex: 2,
    explanation: "Das Elfmeterschießen wurde 1978 bei der WM in Argentinien eingeführt.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Team besiegte Brasilien 2014 im WM-Halbfinale mit 7:1?",
    answers: ["Argentinien", "Deutschland", "Niederlande", "Frankreich"],
    correctIndex: 1,
    explanation: "Deutschland besiegte Brasilien am 8. Juli 2014 mit 7:1 – das 'Mineiraço'.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie heißt der Rekordnationalspieler Deutschlands?",
    answers: ["Miroslav Klose", "Lothar Matthäus", "Thomas Müller", "Bastian Schweinsteiger"],
    correctIndex: 1,
    explanation: "Lothar Matthäus hat 150 Länderspiele für Deutschland bestritten – Rekord.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welches Land wurde 1930 und 1950 Weltmeister?",
    answers: ["Brasilien", "Italien", "Argentinien", "Uruguay"],
    correctIndex: 3,
    explanation: "Uruguay gewann beide Male die WM – 1930 im eigenen Land und 1950 in Brasilien.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein hat als erster ein Triple aus Meisterschaft, Pokal und Europapokal gewonnen?",
    answers: ["Celtic Glasgow (1967)", "Ajax Amsterdam (1972)", "Bayern München (1974)", "Manchester United (1999)"],
    correctIndex: 0,
    explanation: "Celtic Glasgow gewann 1967 als erster Verein das Triple.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "In welchem Jahr wurde die Rückpassregel eingeführt?",
    answers: ["1986", "1990", "1992", "1994"],
    correctIndex: 2,
    explanation: "Seit 1992 darf der Torwart Rückpässe mit dem Fuß nicht mehr aufnehmen.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte den schnellsten Hattrick in der Premier League?",
    answers: ["Sadio Mané", "Robbie Fowler", "Sergio Agüero", "Haaland"],
    correctIndex: 0,
    explanation: "Sadio Mané erzielte 2015 den schnellsten Premier-League-Hattrick in 2 Minuten 56 Sekunden.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Wie hieß der erste schwarze Spieler in der deutschen Nationalmannschaft?",
    answers: ["Gerald Asamoah", "Erwin Kostedde", "Jimmy Hartwig", "Anthony Baffoe"],
    correctIndex: 1,
    explanation: "Erwin Kostedde war 1974 der erste schwarze Nationalspieler Deutschlands.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land gewann die WM 1978?",
    answers: ["Brasilien", "Niederlande", "Argentinien", "Deutschland"],
    correctIndex: 2,
    explanation: "Argentinien gewann die WM 1978 im eigenen Land mit 3:1 gegen die Niederlande im Finale.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele WM-Titel hat Italien gewonnen?",
    answers: ["3", "4", "5", "2"],
    correctIndex: 1,
    explanation: "Italien hat 4 WM-Titel gewonnen (1934, 1938, 1982, 2006).",
    difficulty: "schwer",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welcher Verein gewann 1995 die Champions League mit einer jungen Mannschaft aus der eigenen Jugend?",
    answers: ["AC Mailand", "Ajax Amsterdam", "Juventus", "Borussia Dortmund"],
    correctIndex: 1,
    explanation: "Ajax Amsterdam gewann 1995 mit jungen Spielern wie Kluivert, Seedorf und Davids.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Was war das 'Bosman-Urteil' und wann war es?",
    answers: ["Freie Transfers nach Vertragsende (1995)", "Einführung der Roten Karte (1970)", "Einführung von VAR (2018)", "Gehaltsobergrenze (2000)"],
    correctIndex: 0,
    explanation: "Das Bosman-Urteil 1995 erlaubte Spielern nach Vertragsende ablösefrei zu wechseln.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land gewann 1990 die Fußball-WM?",
    answers: ["Argentinien", "Italien", "Deutschland", "England"],
    correctIndex: 2,
    explanation: "Deutschland (damals Westdeutschland) gewann die WM 1990 in Italien.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele Tore erzielte Gerd Müller in seiner Bundesliga-Karriere?",
    answers: ["286", "325", "365", "398"],
    correctIndex: 2,
    explanation: "Gerd Müller erzielte 365 Bundesliga-Tore – ein Rekord, der lange hielt.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welcher Verein gewann 1997 die Champions League als erster deutscher Verein seit Bayern?",
    answers: ["Schalke 04", "Borussia Dortmund", "Werder Bremen", "Hamburger SV"],
    correctIndex: 1,
    explanation: "Borussia Dortmund gewann 1997 die Champions League mit einem 3:1 gegen Juventus.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "In welchem Jahr fand die WM erstmals in Asien statt?",
    answers: ["1998", "2002", "2006", "2010"],
    correctIndex: 1,
    explanation: "Die WM 2002 in Japan und Südkorea war die erste in Asien.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte das goldene Tor im EM-Finale 1996?",
    answers: ["Klinsmann", "Bierhoff", "Sammer", "Kuntz"],
    correctIndex: 1,
    explanation: "Oliver Bierhoff erzielte das erste Golden Goal der EM-Geschichte im Finale 1996.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie heißt das Stadion in dem das WM-Finale 2014 stattfand?",
    answers: ["Estádio do Maracanã", "Arena Corinthians", "Estádio Mineirão", "Estádio Castelão"],
    correctIndex: 0,
    explanation: "Das WM-Finale 2014 fand im legendären Maracanã-Stadion in Rio de Janeiro statt.",
    difficulty: "schwer",
    category: "Stadien"
  },
  {
    question: "Welcher Trainer gewann die Champions League mit drei verschiedenen Vereinen?",
    answers: ["José Mourinho", "Pep Guardiola", "Carlo Ancelotti", "Zinédine Zidane"],
    correctIndex: 2,
    explanation: "Carlo Ancelotti gewann mit AC Mailand (2x) und Real Madrid die Champions League.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Was war das 'Nichtangriffspakt'-Spiel der WM 1982?",
    answers: ["Deutschland - Österreich", "Brasilien - Italien", "Frankreich - Deutschland", "Polen - Sowjetunion"],
    correctIndex: 0,
    explanation: "Deutschland und Österreich spielten 1982 ein 1:0, das beiden zum Weiterkommen reichte – die 'Schande von Gijón'.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein hat die meisten deutschen Meistertitel?",
    answers: ["Borussia Dortmund", "FC Bayern München", "Hamburger SV", "Werder Bremen"],
    correctIndex: 1,
    explanation: "Der FC Bayern München hat mit über 30 Titeln die meisten deutschen Meisterschaften.",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "In welchem Jahr spielte Maradona seine legendäre WM?",
    answers: ["1982", "1986", "1990", "1994"],
    correctIndex: 1,
    explanation: "Maradonas legendäre WM war 1986 in Mexiko, wo er Argentinien fast im Alleingang zum Titel führte.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Team gewann den ersten Weltpokal (Intercontinental Cup) 1960?",
    answers: ["Santos", "Real Madrid", "Peñarol", "Benfica"],
    correctIndex: 2,
    explanation: "Peñarol aus Uruguay gewann 1960 den ersten Weltpokal.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele Länderspieltore hat Cristiano Ronaldo erzielt (ungefähr)?",
    answers: ["90-100", "100-110", "120-135", "Über 135"],
    correctIndex: 2,
    explanation: "Cristiano Ronaldo hat über 130 Länderspieltore erzielt – Weltrekord.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welcher GAK-Spieler wurde österreichischer Fußballer des Jahres?",
    answers: ["Mario Haas", "Ivica Vastić", "Roland Kirchler", "Markus Schopp"],
    correctIndex: 0,
    explanation: "Mario Haas wurde als GAK-Spieler österreichischer Fußballer des Jahres.",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "In welchem Jahr gewann Borussia Dortmund seinen ersten Bundesliga-Titel?",
    answers: ["1956", "1963", "1995", "1996"],
    correctIndex: 1,
    explanation: "Borussia Dortmund wurde 1956/57 erster deutscher Meister, und 1963 gewannen sie den DFB-Pokal.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welche Mannschaft gewann die Copa América 2021?",
    answers: ["Brasilien", "Argentinien", "Kolumbien", "Uruguay"],
    correctIndex: 1,
    explanation: "Argentinien gewann die Copa América 2021 und besiegte im Finale Brasilien.",
    difficulty: "schwer",
    category: "Weltmeisterschaft"
  },
  {
    question: "Was ist das 'Hexenkessel'-Stadion von Dortmund und wie viele Zuschauer fasst es?",
    answers: ["60.000", "65.000", "75.000", "81.000"],
    correctIndex: 3,
    explanation: "Der Signal Iduna Park fasst bei Bundesliga-Spielen über 81.000 Zuschauer.",
    difficulty: "schwer",
    category: "Stadien"
  },
  {
    question: "Welcher Spieler wird 'Der achte Weltwunder' genannt und spielte für Brasilien in den 1960ern?",
    answers: ["Pelé", "Garrincha", "Tostão", "Jairzinho"],
    correctIndex: 1,
    explanation: "Garrincha wurde 'Freude des Volkes' und manchmal 'achtes Weltwunder' genannt.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "In welchem Jahr wurde die Champions League in ihrer heutigen Form eingeführt?",
    answers: ["1990", "1992", "1995", "1998"],
    correctIndex: 1,
    explanation: "Die Champions League in ihrer heutigen Form gibt es seit 1992/93.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte bei der WM 2018 einen Hattrick im Eröffnungsspiel?",
    answers: ["Ronaldo", "Messi", "Mbappé", "Griezmann"],
    correctIndex: 0,
    explanation: "Cristiano Ronaldo erzielte einen Hattrick gegen Spanien im Eröffnungsspiel (3:3).",
    difficulty: "schwer",
    category: "Weltmeisterschaft"
  },
  {
    question: "Wie heißt der teuerste Transfer aller Zeiten (Stand 2023)?",
    answers: ["Mbappé zu Real Madrid", "Neymar zu PSG", "Coutinho zu Barcelona", "Grealish zu Man City"],
    correctIndex: 1,
    explanation: "Neymars Transfer von Barcelona zu PSG für 222 Millionen Euro (2017) ist der teuerste.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welcher deutsche Verein ging 2022 in die 2. Bundesliga und war vorher Rekordmeister der DDR?",
    answers: ["Hertha BSC", "Dynamo Dresden", "1. FC Magdeburg", "Hansa Rostock"],
    correctIndex: 1,
    explanation: "Dynamo Dresden war DDR-Rekordmeister und spielte in der 2. und 3. Liga.",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "Welches Land gewann die WM 1994?",
    answers: ["Italien", "Brasilien", "Deutschland", "Schweden"],
    correctIndex: 1,
    explanation: "Brasilien gewann die WM 1994 in den USA im Elfmeterschießen gegen Italien.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele Zuschauer fasst das Maracanã-Stadion heute (nach dem Umbau)?",
    answers: ["55.000", "65.000", "78.000", "100.000"],
    correctIndex: 2,
    explanation: "Das Maracanã fasst nach dem Umbau für die WM 2014 etwa 78.000 Zuschauer.",
    difficulty: "schwer",
    category: "Stadien"
  },
  {
    question: "Wer ist der jüngste Torschütze der Bundesliga-Geschichte?",
    answers: ["Florian Wirtz", "Youssoufa Moukoko", "Kai Havertz", "Timo Werner"],
    correctIndex: 1,
    explanation: "Youssoufa Moukoko war mit 16 Jahren und 28 Tagen der jüngste Bundesliga-Torschütze.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welche WM war die erste mit 32 Mannschaften?",
    answers: ["1994", "1998", "2002", "2006"],
    correctIndex: 1,
    explanation: "Die WM 1998 in Frankreich war die erste mit 32 teilnehmenden Mannschaften.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte das schnellste Tor in der WM-Geschichte?",
    answers: ["Hakan Şükür (2002)", "Clint Dempsey (2014)", "Lahm (2006)", "Mbappé (2022)"],
    correctIndex: 0,
    explanation: "Hakan Şükür erzielte 2002 nach nur 11 Sekunden das schnellste WM-Tor.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "In welchem Jahr fand die WM erstmals in Afrika statt?",
    answers: ["2006", "2010", "2014", "2018"],
    correctIndex: 1,
    explanation: "Die WM 2010 in Südafrika war die erste auf dem afrikanischen Kontinent.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler hält den Rekord für die meisten Einsätze in der Champions League?",
    answers: ["Cristiano Ronaldo", "Iker Casillas", "Lionel Messi", "Xavi"],
    correctIndex: 0,
    explanation: "Cristiano Ronaldo hat die meisten Einsätze in der Champions-League-Geschichte.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welches Land wurde bei der WM 1974 mit dem 'Totaalvoetbal' berühmt?",
    answers: ["Brasilien", "Niederlande", "Deutschland", "Frankreich"],
    correctIndex: 1,
    explanation: "Die Niederlande prägten 1974 mit Johan Cruyff den 'Totalen Fußball'.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie hieß der erste deutsche Meister (1903)?",
    answers: ["VfB Leipzig", "FC Bayern München", "Schalke 04", "1. FC Nürnberg"],
    correctIndex: 0,
    explanation: "Der VfB Leipzig wurde 1903 erster deutscher Fußballmeister.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein gewann 2010 als erster das 'Sextuple' (6 Titel in einem Jahr)?",
    answers: ["Real Madrid", "FC Barcelona", "Bayern München", "Manchester City"],
    correctIndex: 1,
    explanation: "Der FC Barcelona gewann 2009 sechs Titel in einem Kalenderjahr unter Pep Guardiola.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie alt war Ronaldo (Brasilien), als er seinen ersten WM-Titel gewann?",
    answers: ["17", "19", "21", "25"],
    correctIndex: 2,
    explanation: "Ronaldo war 21 Jahre alt bei der WM 2002 (sein erster Titel als Stammspieler).",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land hat die meisten Teilnahmen an Fußball-Weltmeisterschaften?",
    answers: ["Deutschland", "Brasilien", "Italien", "Argentinien"],
    correctIndex: 1,
    explanation: "Brasilien ist das einzige Land, das an allen WM-Turnieren teilgenommen hat.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Wann wurde die Torlinientechnologie erstmals bei einer WM eingesetzt?",
    answers: ["2010", "2014", "2018", "2022"],
    correctIndex: 1,
    explanation: "Bei der WM 2014 in Brasilien wurde erstmals die Torlinientechnologie eingesetzt.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler gewann als Spieler und Trainer die WM?",
    answers: ["Pelé", "Beckenbauer", "Zagallo", "Beckenbauer und Zagallo"],
    correctIndex: 3,
    explanation: "Sowohl Franz Beckenbauer als auch Mário Zagallo gewannen die WM als Spieler und Trainer.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele Bundesliga-Titel hat der FC Bayern München in Folge gewonnen (Rekord)?",
    answers: ["7", "8", "9", "11"],
    correctIndex: 3,
    explanation: "Der FC Bayern gewann von 2013 bis 2023 elf Meisterschaften in Folge.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welches war das erste WM-Finale, das im Elfmeterschießen entschieden wurde?",
    answers: ["1986", "1990", "1994", "1998"],
    correctIndex: 2,
    explanation: "Das WM-Finale 1994 zwischen Brasilien und Italien war das erste, das im Elfmeterschießen endete.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte bei einer einzigen WM die meisten Tore?",
    answers: ["Just Fontaine (13, 1958)", "Gerd Müller (10, 1970)", "Ronaldo (8, 2002)", "Mbappé (8, 2022)"],
    correctIndex: 0,
    explanation: "Just Fontaine aus Frankreich erzielte 1958 unglaubliche 13 Tore bei einer WM – ungebrochen!",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "In welchem Jahr wurde der Videoschiedsrichter (VAR) erstmals bei einer WM eingesetzt?",
    answers: ["2014", "2018", "2022", "Er wurde noch nie eingesetzt"],
    correctIndex: 1,
    explanation: "Der VAR wurde 2018 bei der WM in Russland erstmals eingesetzt.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein gewann als letzter die Champions League ohne einen einzigen Legionär?",
    answers: ["AC Mailand 1994", "Steaua Bukarest 1986", "Nottingham Forest 1980", "Aston Villa 1982"],
    correctIndex: 1,
    explanation: "Steaua Bukarest gewann 1986 den Europapokal nur mit rumänischen Spielern.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land organisierte als erstes eine Fußball-WM mit 48 Mannschaften?",
    answers: ["USA/Kanada/Mexiko 2026", "Katar 2022", "Saudi-Arabien 2034", "Marokko 2030"],
    correctIndex: 0,
    explanation: "Die WM 2026 in USA, Kanada und Mexiko wird die erste mit 48 Mannschaften sein.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wann gewann Sturm Graz seinen ersten österreichischen Meistertitel?",
    answers: ["1995", "1998", "1999", "2001"],
    correctIndex: 1,
    explanation: "Sturm Graz wurde 1998 zum ersten Mal österreichischer Meister.",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "Welcher Spieler wurde 'O Fenômeno' (Das Phänomen) genannt?",
    answers: ["Pelé", "Ronaldinho", "Ronaldo (Brasilien)", "Neymar"],
    correctIndex: 2,
    explanation: "Der brasilianische Ronaldo wurde wegen seiner unglaublichen Fähigkeiten 'O Fenômeno' genannt.",
    difficulty: "schwer",
    category: "Spieler"
  },
  {
    question: "In welchem Jahr gewann Griechenland überraschend die Europameisterschaft?",
    answers: ["2000", "2004", "2008", "2012"],
    correctIndex: 1,
    explanation: "Griechenland gewann 2004 sensationell die EM in Portugal.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele WM-Titel hat Argentinien insgesamt?",
    answers: ["2", "3", "4", "1"],
    correctIndex: 1,
    explanation: "Argentinien hat 3 WM-Titel: 1978, 1986 und 2022.",
    difficulty: "schwer",
    category: "Weltmeisterschaft"
  },
  {
    question: "Welcher Verein hielt 49 Spiele in Folge ohne Niederlage in der Premier League?",
    answers: ["Manchester United", "Chelsea", "Arsenal", "Liverpool"],
    correctIndex: 2,
    explanation: "Arsenal blieb 2003/04 die gesamte Saison ungeschlagen – die 'Invincibles'.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Wer war der erste Spieler, der den Ballon d'Or drei Mal gewann?",
    answers: ["Pelé", "Cruyff", "Platini", "van Basten"],
    correctIndex: 2,
    explanation: "Michel Platini gewann den Ballon d'Or 1983, 1984 und 1985 – drei Mal in Folge.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Verein gewann 2001 den UEFA-Cup mit einem Golden Goal im Finale?",
    answers: ["Feyenoord", "Liverpool", "Alavés", "Borussia Dortmund"],
    correctIndex: 1,
    explanation: "Liverpool gewann 2001 den UEFA-Cup im dramatischen Finale 5:4 gegen Alavés.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "In welchem Jahr wurde die 3-Punkte-Regel in der Bundesliga eingeführt?",
    answers: ["1990", "1992", "1995", "1998"],
    correctIndex: 2,
    explanation: "Seit der Saison 1995/96 gibt es in der Bundesliga 3 Punkte für einen Sieg statt 2.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler erzielte das 'Phantom-Tor' im DFB-Pokalfinale 2004?",
    answers: ["Asamoah", "Ailton", "Klasnić", "Micoud"],
    correctIndex: 0,
    explanation: "Gerald Asamoah erzielte im Pokalfinale 2004 ein umstrittenes Tor mit der Hand.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land gewann die WM 1934 und 1938?",
    answers: ["Brasilien", "Uruguay", "Deutschland", "Italien"],
    correctIndex: 3,
    explanation: "Italien gewann die WM zweimal hintereinander – 1934 und 1938.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Wie viele Länderspiele bestritt Pelé für Brasilien?",
    answers: ["72", "82", "92", "112"],
    correctIndex: 2,
    explanation: "Pelé bestritt 92 Länderspiele für Brasilien und erzielte 77 Tore.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Welcher Torwart hielt im WM-Finale 2006 zwei Elfmeter?",
    answers: ["Lehmann", "Buffon", "Barthez", "Cech"],
    correctIndex: 1,
    explanation: "Gianluigi Buffon war Italiens Torwart, aber im Elfmeterschießen hielt kein Torwart – Frankreich verschoss. Italien gewann 5:3.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Team hält den Rekord für die meisten aufeinanderfolgenden Siege in einer Top-Liga?",
    answers: ["Bayern München (19)", "Manchester City (21)", "Real Madrid (22)", "Bayer Leverkusen (16)"],
    correctIndex: 0,
    explanation: "Bayern München hielt lange den Rekord mit 19 Siegen in Folge in der Bundesliga.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Wann gewann der Grazer AK seinen letzten österreichischen Meistertitel?",
    answers: ["2001", "2003", "2004", "2006"],
    correctIndex: 2,
    explanation: "Der GAK wurde 2004 zum letzten Mal österreichischer Meister.",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "Welcher Spieler erzielte im Champions-League-Finale 2017 zwei Tore für Real Madrid?",
    answers: ["Ronaldo", "Benzema", "Bale", "Ramos"],
    correctIndex: 0,
    explanation: "Cristiano Ronaldo erzielte im CL-Finale 2017 gegen Juventus zwei Tore (4:1).",
    difficulty: "schwer",
    category: "Vereine"
  },
  {
    question: "In welchem Jahr gewann Dänemark überraschend die Europameisterschaft?",
    answers: ["1988", "1992", "1996", "2000"],
    correctIndex: 1,
    explanation: "Dänemark gewann 1992 sensationell die EM, obwohl sie erst kurzfristig nachnominiert wurden.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welcher Spieler hält den Rekord für die meisten Assists in der Bundesliga?",
    answers: ["Franck Ribéry", "Thomas Müller", "Mesut Özil", "Kevin De Bruyne"],
    correctIndex: 1,
    explanation: "Thomas Müller ist der Rekord-Vorlagengeber der Bundesliga.",
    difficulty: "schwer",
    category: "Rekorde"
  },
  {
    question: "Wie hieß der legendäre Trainer von AC Mailand, der den 'Catenaccio' perfektionierte?",
    answers: ["Arrigo Sacchi", "Nereo Rocco", "Giovanni Trapattoni", "Fabio Capello"],
    correctIndex: 1,
    explanation: "Nereo Rocco machte den Catenaccio (Riegel-Taktik) in den 1960ern berühmt.",
    difficulty: "schwer",
    category: "Geschichte"
  },
  {
    question: "Welches Land verlor drei WM-Finale hintereinander (1974, 1978, 2010)?",
    answers: ["Deutschland", "Argentinien", "Niederlande", "Brasilien"],
    correctIndex: 2,
    explanation: "Die Niederlande verloren die WM-Finale 1974, 1978 und 2010.",
    difficulty: "schwer",
    category: "Geschichte"
  },
]

// Combine all questions: base (100 each) + all extras + 350-batch
export const questions = [...baseQuestions, ...schwerExtra, ...extraLeicht, ...extraMittel, ...extraSchwer, ...bulkLeicht, ...bulkMittel, ...bulkSchwer, ...more350Leicht, ...more350Mittel, ...more350Schwer]
