// Union types
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${typeof padding}'.`);
}
padLeft("Hello world", 4); // "    Hello world"
padLeft("Hello", "z"); // "zHello"
// let indentedString = padLeft("Hello world", true); // Error at runtime

// Union with common fields
interface Bird {
  fly(): void;
  layEggs(): void;
}
interface Fish {
  swim(): void;
  layEggs(): void;
}
declare function getSmallPet(): Fish | Bird;
let pet = getSmallPet();
pet.layEggs();
// pet.swim() // Error only avaiable with Fish

// Discriminating unions
type NetworkLoadingState = {
  state: "loading";
};
type NetworkFailedState = {
  state: "failed";
  code: number;
};
type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;
function logger(s: NetworkState): string {
  // state.code // Error TS doesnt know which of three states yet

  switch (s.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      return `Error ${s.code} downloading`;
    case "success":
      return `Download ${s.response.title} - ${s.response.summary}`;
  }
}

// Union exhaustiveness checking
type NetworkFromCacheState = {
  state: "from_cache";
  id: string;
  response: NetworkSuccessState["response"];
};
function assertNever(x: never): never {
  throw new Error("Unexpeted object: " + x);
}
type NetworkState2 = NetworkState | NetworkFromCacheState;
function logger2(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
    // Missing case "from_cache" --strictNullChecks
    default:
      return assertNever(s); // Error NetworkFromCachedState not assignable to type never - reminds you that the case is not exhaustive enough
  }
}

// Intersection types
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}
interface ArtworksData {
  artworks: { title: string }[];
}
interface ArtistsData {
  artists: { name: string }[];
}
// Above interfaces are composed to have consistent error handling of their own data
type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }
  console.log(response.artists);
};
handleArtistsResponse({
  artists: [{ name: "donatello" }, { name: "raphael" }],
  success: true,
});
