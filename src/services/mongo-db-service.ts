import { MongoClient } from 'mongodb';
import { emotesTable } from '../data/constants';

export class MongoDBService implements DatabaseService {
  private dbAddress = 'mongodb://database:27017/brotherbot';
  private dbName = 'brotherbot';
  private MongoClient = MongoClient;

  public getAllFromTable(table: string): Promise<Array<Record<string, unknown>>> {
    return new Promise<Array<Record<string, unknown>>>((resolve, reject) => {
      this.MongoClient.connect(this.dbAddress, async (error: Error, client: MongoClient) => {
        if (error) {
          reject('A database error occured');
        }

        const db = client.db(this.dbName);

        resolve(await db.collection(table).find().toArray());
      });
    });
  }

  public incrementFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    incrementField: string,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.MongoClient.connect(this.dbAddress, async (error: Error, client: MongoClient) => {
        if (error) {
          reject('A database error occured');
        }

        const db = client.db(this.dbName);

        await db
          .collection(table)
          .updateOne(
            { [filterField]: filterValue },
            { $inc: { [incrementField]: 1 } },
            { upsert: true },
          );
        resolve();
      });
    });
  }

  public initialSetup(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.MongoClient.connect(this.dbAddress, async (error: Error, client: MongoClient) => {
        if (error) {
          reject('A database error occured');
        }

        const db = client.db(this.dbName);

        await db.dropCollection(emotesTable);
        await db.collection(emotesTable).insertMany([
          { name: '<:JuleLol:315159742202904577>', amount: '250' },
          { name: '<:Porg:368082139876687874>', amount: '61' },
          { name: '<:TWoo:312711418304790540>', amount: '1407' },
          { name: '<:Fine:319851568679747584>', amount: '43' },
          { name: '<:WW:312699900431302667>', amount: '62' },
          { name: '<:Feels:311241302547103755>', amount: '470' },
          { name: '<:Kappa:311240904642002946>', amount: '583' },
          { name: '<:Smite:311235530819895297>', amount: '80' },
          { name: '<:DrD:311246336551026689>', amount: '584' },
          { name: '<:wat:363593587331432449>', amount: '23' },
          { name: '<:DonaldThumb:311577158524993536>', amount: '187' },
          { name: '<:TB:311237452637536257>', amount: '147' },
          { name: '<:TWooPride:364491785969336320>', amount: '66' },
          { name: '<:Svinemunken:311833020967682048>', amount: '78' },
          { name: '<:OfficerMG:312166676680409089>', amount: '103' },
          { name: '<:MG:318814706485952512>', amount: '48' },
          { name: '<:FTB:363239557149229056>', amount: '18' },
          { name: '<:PlatKing:366662608339730433>', amount: '39' },
          { name: '<:FeelsG:333969809094082571>', amount: '193' },
          { name: '<:Cry:374910178421899264>', amount: '98' },
          { name: '<:Illuminati:321593532693610496>', amount: '44' },
          { name: '<:MJ2:318662297667239936>', amount: '3' },
          { name: '<:DnD:311247499446845450>', amount: '5' },
          { name: '<:CageO:315192435871580161>', amount: '74' },
          { name: '<:Wutface:353620270881177605>', amount: '175' },
          { name: '<:10:311822368991477761>', amount: '324' },
          { name: '<:Marx:311827315665666058>', amount: '14' },
          { name: '<:TommyPeace:312240893400711218>', amount: '11' },
          { name: '<:Simone:363375146410704896>', amount: '25' },
          { name: '<:Slowpoke:319185828893032469>', amount: '24' },
          { name: '<:Aka:372074499782475777>', amount: '46' },
          { name: '<:Amin:362907076609179648>', amount: '51' },
          { name: '<:MTG:355515587218374676>', amount: '86' },
          { name: '<:Miikl:312174514131697664>', amount: '101' },
          { name: '<:Facepalm:328151803096989696>', amount: '58' },
          { name: '<:Munkesvinet:311829548306137089>', amount: '65' },
          { name: '<:BronzeScrub:365533184265551874>', amount: '21' },
          { name: '<:TakeNRG:325027901194108928>', amount: '44' },
          { name: '<:TommyxD:312239130472087555>', amount: '9' },
          { name: '<:CagedCat:315195072054427650>', amount: '1' },
          { name: '<:MJ:318661495070261249>', amount: '1' },
          { name: '<:R6:358970505333702657>', amount: '1' },
          { name: '<:Jebaited:351024977585242113>', amount: '10' },
          { name: '<:MonkaS:388279075157966848>', amount: '5' },
          { name: '<:TommyMeme:312244907655823361>', amount: '7' },
          { name: '<:Waifu:392102348924649472>', amount: '3' },
          { name: '<:Waifu:392102541984268298>', amount: '132' },
          { name: '<:BBB:364515156312588288>', amount: '36' },
          { name: '<:4Head:348423164268904449>', amount: '37' },
          { name: '<:Thonk:393065751747231754>', amount: '178' },
          { name: '<:PUBG:395646598278807552>', amount: '7' },
          { name: '<:MJ:318662297667239936>', amount: '25' },
          { name: '<:CF:399886212703453184>', amount: '2' },
          { name: '<:SilverPleb:366236965022203904>', amount: '2' },
          { name: '<:MonkaS:403843381178007553>', amount: '120' },
          { name: '<:W_:406750241769914379>', amount: '1' },
          { name: '<:W_:406750630309265419>', amount: '2' },
          { name: '<:UU:406750928033546240>', amount: '125' },
          { name: '<:POGGERS:417357003040751619>', amount: '511' },
          { name: '<:Salt:311884670243569684>', amount: '13' },
          { name: '<:Fist:436144035737108495>', amount: '76' },
          { name: '<:Trier:504317328532701194>', amount: '13' },
          { name: '<:CapitalD:526483154417221652>', amount: '26' },
          { name: '<:MexicanSoren:662729406317592576>', amount: '10' },
          { name: '<:serious:703236485448597520>', amount: '21' },
          { name: '<:PepeHands:704988693026308137>', amount: '11' },
          { name: '<:gun:704988543453364245>', amount: '30' },
          { name: '<:bye:704988437064843396>', amount: '6' },
          { name: '<:MGhype:707968411002732557>', amount: '3' },
          { name: '<:MGhype:707969594215759872>', amount: '60' },
          { name: '<:amin:707970796567396363>', amount: '1' },
          { name: '<:ainsley:707970881795653692>', amount: '5' },
          { name: '<:DrHygge:711001637006868541>', amount: '5' },
          { name: '<:MGWAT:714238876461432933>', amount: '10' },
          { name: '<:MGWat:714238876461432933>', amount: '10' },
          { name: '<:MGwat:716329194040066078>', amount: '1' },
          { name: '<:MGwatemote3:716333892566646804>', amount: '1' },
          { name: '<:MGwat:716336515638231231>', amount: '11' },
          { name: '<:MGWat:716336515638231231>', amount: '11' },
          { name: '<:NicVR:722175769031475280>', amount: '1' },
          { name: '<:NicVR:722177259204640840>', amount: '13' },
        ]);
        resolve();
      });
    });
  }
}
