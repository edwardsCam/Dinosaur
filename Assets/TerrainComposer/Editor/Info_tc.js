#pragma strict

class Info_tc extends EditorWindow
{
	var text: String;
	var label_old: float;
	var foldout: boolean = true;
	var backgroundColor: Color;
	var backgroundActive: boolean = true;
	var global_script: global_settings_tc;
	var scrollPos: Vector2;
	var update_height: int;
	var parent: EditorWindow;	
		
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow (Info_tc);
        window.title = "Update";
    }
    
    function OnDisable()
    { 
    	if (parent) {
    		// parent.info_window = false;
    		parent.Repaint();
    	}
    }
    
 	function OnGUI()
	{
		if (global_script.tex1 && backgroundActive)
        {
	       	GUI.color = backgroundColor;
	       	EditorGUI.DrawPreviewTexture(Rect(0,0,position.width,position.height),global_script.tex1);
	       	GUI.color = UnityEngine.Color.white;
	    }
	    else
	    {
	    	global_script.tex1 = new Texture2D(1,1);
	    }
		
		GUI.color = Color.white;
		
		scrollPos = EditorGUILayout.BeginScrollView(scrollPos,GUILayout.Width(position.width),GUILayout.Height(position.height));
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField(text,GUILayout.Height(update_height));
		EditorGUILayout.EndHorizontal();
		EditorGUILayout.EndScrollView();
	}
}