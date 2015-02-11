#pragma strict

class Reset_Windows extends EditorWindow 
{

	@MenuItem ("Window/Reset Windows")
    
	static function ShowWindow() 
	{
        var tc_windows: TerrainComposer[] = UnityEngine.Resources.FindObjectsOfTypeAll(typeof(TerrainComposer)) as TerrainComposer[];
        
        Debug.Log(tc_windows.Length);
        
        for (var count: int = 0;count < tc_windows.Length;++count) {
        	// DestroyImmediate(tc_windows[count]);
        	if (tc_windows[count]) {tc_windows[count].Close ();}
        }
        
        var filterTexture: FilterTexture[] = UnityEngine.Resources.FindObjectsOfTypeAll(typeof(FilterTexture)) as FilterTexture[];
        
        for (count = 0;count < filterTexture.Length;++count) {
        	// DestroyImmediate(tc_windows[count]);
        	if (filterTexture[count]) {filterTexture[count].Close ();}
        }
        
        var assignTextures: AssignTextures[] = UnityEngine.Resources.FindObjectsOfTypeAll(typeof(AssignTextures)) as AssignTextures[];
        
        for (count = 0;count < assignTextures.Length;++count) {
        	// DestroyImmediate(tc_windows[count]);
        	if (assignTextures[count]) {assignTextures[count].Close ();}
        }
        
        var showTexture: ShowTexture[] = UnityEngine.Resources.FindObjectsOfTypeAll(typeof(ShowTexture)) as ShowTexture[];
        
        for (count = 0;count < showTexture.Length;++count) {
        	// DestroyImmediate(tc_windows[count]);
        	if (showTexture[count]) {showTexture[count].Close ();}
        }
    }
}