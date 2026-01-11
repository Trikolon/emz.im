const litGlobals = globalThis as { litIssuedWarnings?: Set<string> };
litGlobals.litIssuedWarnings ??= new Set();
litGlobals.litIssuedWarnings.add("dev-mode");
