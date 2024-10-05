
export class Estimate {
    averageShopPrice: number;
    averageRepairPrice: number;
    expectedRepairTime: string;
    repairDifficulty: string;
    summary: string;
    toolsAndMaterials: string[];
    constructor(data: any = {}) {
      this.averageShopPrice = data.averageShopPrice || 0;
      this.averageRepairPrice = data.averageRepairPrice || 0;
      this.expectedRepairTime = data.expectedRepairTime || 'Unknown';
      this.repairDifficulty = data.repairDifficulty || 'Unknown';
      this.toolsAndMaterials = data.toolsAndMaterials || [];
      this.summary = data.summary || '';
    }
  }
  
  export class Parts_Tools {
    parts: string[];
    tools: string[];
    constructor(data: any = {}) {
      this.parts = data.parts || [];
      this.tools = data.tools || [];
    }
  }


  export class Instructions {
    steps: string[];
    constructor(data: any = {}) {
      this.steps = data.steps || [];
    }
  }
  
  export class ProjectData {
    type: 'repair' | 'mod';
    difficulty: string;
    estimate: Estimate;
    expectedTime: string;
    parts_tools: Parts_Tools;
    instructions: Instructions;
    projectId: string;
    userId: string;
    createdAt: Date;
    carProfileId: string;
    image: string;
    imageDescription: string;
    problemDescription: string;
    constructor(data: any = {}) {
      this.type = data.type || 'repair';
      this.difficulty = data.difficulty || 'Unknown';
      this.estimate = new Estimate(data.estimate) || new Estimate();
      this.expectedTime = data.expectedTime || 'Unknown';
      this.parts_tools = new Parts_Tools(data.parts_tools) || new Parts_Tools();
      this.instructions = new Instructions(data.instructions) || new Instructions();
      this.projectId = data.projectId || '';
      this.userId = data.userId || '';
      this.createdAt = data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date();
      this.carProfileId = data.carProfileId || '';
      this.image = data.image || '';
      this.imageDescription = data.imageDescription || '';
      this.problemDescription = data.problemDescription || '';
      this.userId = data.userId || '';
    }
  }