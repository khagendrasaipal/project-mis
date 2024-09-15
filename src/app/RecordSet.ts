class FieldCollection {
  count: number;
  collection: Record<string, any>;
  fieldName: string | null;
  value: any | null;

  constructor() {
    this.count = 0;
    this.collection = {};
    this.fieldName = null;
    this.value = null;
  }

  add(key: string, item: any): number | undefined {
    if (this.collection[key] !== undefined) {
      return undefined;
    }
    this.collection[key] = item;
    return ++this.count;
  }

  remove(key: string | number): number | undefined {
    if (typeof key === "number") {
      const nkey = this.keys(key);
      if (nkey === undefined) {
        return undefined;
      }
      delete this.collection[nkey];
    } else {
      if (this.collection[key] === undefined) {
        return undefined;
      }
      delete this.collection[key];
    }
    return --this.count;
  }

  item(key: string | number): any {
    if (typeof key === "number") {
      let ti = -1;
      for (const index in this.collection) {
        ti++;
        if (key === ti) {
          return this.collection[index];
        }
      }
    } else {
      return this.collection[key];
    }
  }

  keys(ind: number): any {
    let ti = -1;
    for (const index in this.collection) {
      ti++;
      if (ind === ti) {
        return index;
      }
    }
  }
}

export class RecordSet {
  state: number;
  recordCount: number;
  resource: any | null;
  pointer: number;
  Fields: FieldCollection | null;
  fld: FieldCollection | null;

  constructor() {
    this.state = 0;
    this.recordCount = 0;
    this.resource = null;
    this.pointer = -1;
    this.Fields = null;
    this.fld = null;
  }

  open(sql: string, connection: any): void {
    this.resource = connection.exec(sql);
    if (this.resource === "") {
      this.state = 1;
      this.recordCount = 0;
      return;
    }
    this.state = 1;
    this.pointer = 0;
    this.fld = new FieldCollection();
    this.fld.count = this.resource[0]?.columns?.length || 0;
    this.recordCount = this.resource[0]?.values?.length || 0;
    this.Fields = this.fld;

    if(this.fld.count){
      for (let i = 0; i < this.resource[0].columns.length; i++) {
        this.fld.add(this.resource[0].columns[i].toLowerCase(), i);
      }
    }
    
  }

  fields(index?: string | number): FieldCollection | any {

    if (index === undefined) {
      console.log("fc: "+this.Fields?.count);
      return this.Fields;
    }

    let i = 0;
    if (typeof index === "number") {
      i = index;
      this.fld!.fieldName = this.resource[0].columns[i];
      this.fld!.value = ""+this.resource[0].values[this.pointer][i];
    } else {
      i = this.fld!.item(index.toLowerCase());
      if (i === undefined || isNaN(i)) {
        console.log("Error: unidentified column name:" + index);
        i = 0;
      }
      this.fld!.fieldName = this.resource[0].columns[i];
      this.fld!.value = ""+this.resource[0].values[this.pointer][i];
    }
    return this.fld;
  }

  close(): void {
    this.state = 0;
    this.recordCount = 0;
    this.resource = null;
    this.fld = null;
    this.pointer = -1;
  }

  moveNext(): void {
    if (this.pointer < this.recordCount) {
      this.pointer++;
    }
  }

  movePrevious(): void {
    if (this.pointer >= 0) {
      this.pointer--;
    }
  }

  moveFirst(): void {
    if (this.recordCount > 0) {
      this.pointer = 0;
    }
  }

  goto(index: number): void {
    if (typeof index === "number") {
      if (index < this.recordCount && index >= 0) {
        this.pointer = index;
      }
    }
  }

  moveLast(): void {
    if (this.recordCount > 0) {
      this.pointer = this.recordCount - 1;
    }
  }

  EOF(): boolean {
    return this.pointer >= this.recordCount;
  }

  BOF(): boolean {
    return this.pointer < 0;
  }
}
