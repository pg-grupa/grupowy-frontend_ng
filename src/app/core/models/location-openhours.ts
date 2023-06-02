export interface IOpenHours {
  from: string;
  to: string;
}

export interface ILocationOpenhours {
  Monday: IOpenHours | undefined;
  Tuesday: IOpenHours | undefined;
  Wednesday: IOpenHours | undefined;
  Thursday: IOpenHours | undefined;
  Friday: IOpenHours | undefined;
  Saturday: IOpenHours | undefined;
  Sunday: IOpenHours | undefined;
}
