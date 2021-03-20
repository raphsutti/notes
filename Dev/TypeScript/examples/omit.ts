type OriginalType = {
  id: number;
  name: string;
  hasPowers: boolean;
};

type ModifiedType = Omit<OriginalType, "id" | "hasPowers"> & { ssid: number };

const modifiedVar: ModifiedType = { ssid: 200, name: "james" };
