import { roomData } from '../types/map';

export default class MapState {
  protected static instance: MapState;

  protected mapData: roomData | null = null;
  protected userId: string | null = null;

  public static getInstance(): MapState {
    if (!this.instance) {
      this.instance = new MapState();
    }
    return this.instance;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getUserid(): string | null {
    return this.userId;
  }

  public setMapData(mapData: roomData): void {
    this.mapData = mapData;
  }

  public getMapData(): roomData | null {
    return this.mapData;
  }
}
