#pragma downcast
import System.Collections.Generic;
import System.IO;
import System;
import System.Text;
import System.Reflection;

class Map_tc extends EditorWindow
{
	var texture: Texture2D;
	var display_text: boolean = false;
	var text: String;
	var rotAngle: float = 90;
	var label_old: float;
		
	var scroll: boolean = false;
	var scroll_mode: int = 1;
	var mouse_position: Vector2;
	var mouse_position_old: Vector2;
	var mouse_move: Vector2;
	var key: Event;
	var button0: boolean = false;
	var button2: boolean = false;
	var count_curve: int = 0;
	var offset_map1: Vector2;
	var offset_map2: Vector2;
	var offset_map3: Vector2;
	var offset_map4: Vector2;
	var offset_map: Vector2;
	
	var content_checked: boolean = false;
	
	var offset: Vector2;
	var pixel3: Vector2;
	var pixel4: Vector2;
	var pixels: Color[];
	var offset2: Vector2;
	var time1: float;
	
	var Global_Settings_Scene: GameObject;
    var global_script: global_settings_tc;
    var TerrainComposer_Scene: GameObject; 
    var TerrainComposer_Parent: GameObject;
    var tc_script: EditorWindow;
    var info_window: EditorWindow;
    var terraincomposer: boolean = false;
	// var script: terraincomposer_save;
	var material: Material;
	var zooming: boolean = false;
	var zoom: double;
	var zoom1: double;
	var zoom2: double;
	var zoom3: double;
	var zoom4: double;
	var zoom_step: double;
	var zoom1_step: double;
	var zoom2_step: double;
	var zoom3_step: double;
	var zoom4_step: double;
	var zoom_pos: double; 
	var zoom_pos1: double; 
	var zoom_pos2: double; 
	var zoom_pos3: double; 
	var zoom_pos4: double; 
	
	var request1: boolean;
	var request2: boolean;
	var request3: boolean;
	var request4: boolean;
	var request_load1: boolean;
	var request_load2: boolean;
	var request_load3: boolean;
	var request_load4: boolean;
	var screen_rect: Rect;
	var screen_rect2: Rect;
	
	var map_parameters_rect: Rect;
	var regions_rect: Rect;
	var areas_rect: Rect;
	var heightmap_export_rect: Rect;
	var image_export_rect: Rect;
	var image_editor_rect: Rect;
	var converter_rect: Rect;
	var settings_rect: Rect;
	var create_terrain_rect: Rect;
	var help_rect: Rect;
	var update_rect: Rect;
	
	var animate: boolean = false;
	var latlong_animate: latlong_class;
	var animate_pixel: Vector2;
	var animate_time_start: float;
	
	var script_set: boolean = false;
	var tt1: float;
	
	var gui_y: int;
	var gui_y2: int;
	var gui_y3: int;
	var gui_height: int;
	var guiWidth1: int = 120;
	var guiWidth2: int = 335;
	var current_region: map_region_class;
	var current_area: map_area_class;
	
	var create_region: map_region_class;
	var create_area: map_area_class;
	
	var convert_area: map_area_class;
	var convert_texture: Texture2D;
	var convert_tile: tile_class = new tile_class();
	
	var export_heightmap_region: map_region_class;
	var export_heightmap_area: map_area_class;
	var export_image_region: map_region_class;
	var export_image_area: map_area_class;
	var import_image_area: map_area_class;
	
	var gui_changed_old: boolean;
	
	var requested_area: map_area_class;
	var latlong_mouse: latlong_class;
	var latlong_center: latlong_class;
	var latlong_area: latlong_area_class;
	
	var fs: FileStream;
	var bytes: byte[];
	
	var export_p1: Vector2;
	var export_p2: Vector2;
	var width_p1: float;
	var height_p1: float;
	
	var terrain_region: terrain_region_class = new terrain_region_class();
	var colormap: boolean = true;
	
	var heightmap_resolution_list: String[] = ["33","65","129","257","513","1025","2049","4097"];
	var heightmap_resolution_select: int;
	var image_resolution_list: String[] = ["32","64","128","256","512","1024","2048","4096"];
	var image_resolution_select: int;
	
	var path_old: String;
	var import_settings_call: boolean = false;
	var import_jpg_call: boolean = false;
	var import_png_call: boolean = false;
	var import_jpg_path: String;
	var import_png_path: String;
	
	var map_scrolling: boolean = false;
	var area_rounded: boolean;
	var generate_manual: boolean = false;
	
	var old_fontSize: int;
	var old_fontStyle: FontStyle;
	
	var save_global_time: float;
    
	var focus: boolean = false;
	
	var button_settings: Texture;
	var button_help: Texture;
	var button_heightmap: Texture;
	var button_update: Texture;
	var button_terrain: Texture;
	var button_map: Texture;
	var button_region: Texture;
	var button_edit: Texture;
	var button_image: Texture;
	var button_converter: Texture;
	
	var wc_gui: gui_class = new gui_class(3);
	
	var area_size_old: Vector2;
	
	var notify_text: String = String.Empty; 
	var notify_frame: int = 0;
	
	@MenuItem ("Window/World Composer")
	static function ShowWindow() 
	{
    	var window = EditorWindow.GetWindow (Map_tc);
        window.title = "World";
    }
    
    function OnEnable()
    { 
    	Get_TerrainComposer_Scene();
    	load_button_textures();
    	
    	if (Type.GetType("TerrainComposer")) {terraincomposer = true;} else {terraincomposer = false;}
    	
    	content_startup();
    	request_map();
    }
    
    function Get_TerrainComposer_Scene() 
    {
     	// TerrainComposer_Scene = GameObject.Find("TerrainComposer");
     	// Global_Settings_Scene = GameObject.Find("global_settings");
        
        load_global_settings();
    }
    
	function OnInspectorUpdate()
	{
		if (focus) {
			this.Repaint();
		}
		if (global_script) {
			if (global_script.map.preimage_edit.generate) {
				this.Repaint();
			}
		}
	}
    
    function OnFocus()
	{
		focus = true;
		Get_TerrainComposer_Scene();
		
	   	if (!tc_script)
		{ 
			if (terraincomposer) {tc_script = EditorWindow.GetWindow(Type.GetType("TerrainComposer"));}
		}
		
		init_paths();
	}
	
	function OnLostFocus()
	{
		focus = false;
	}
	
	function OnDisable()
	{
		// save_global_settings();
		if (tc_script) {
			tc_script.Repaint();
		}
	}
	
	function OnDestroy()
	{
		save_global_settings();
		stop_all_elevation_pull();
		stop_all_image_pull();
	}
	
	function OnGUI()
	{
		key = Event.current;
        
        if (!global_script){
        	if (key.type == EventType.Repaint){Get_TerrainComposer_Scene();return;} else {return;}
        }
		
		gui_y = 0;
		gui_y2 = 0;
		var image_width: int;
		var image_height: int;
		
		if (global_script.map.region_select > global_script.map.region.Count-1) {global_script.map.region_select = global_script.map.region.Count-1;}
		current_region = global_script.map.region[global_script.map.region_select];
    	
    	if (current_region.area_select > current_region.area.Count-1) {current_region.area_select = current_region.area.Count-1;}
    	current_area = current_region.area[current_region.area_select];
    	  
		if (!global_script.tex2)
		{
			global_script.tex2 = new Texture2D(1,1);
			global_script.tex2.SetPixel(0,0,global_script.map.backgroundColor);
			global_script.tex2.Apply();
		}
		if (!global_script.tex3)
		{
			global_script.tex3 = new Texture2D(1,1);
			global_script.tex3.SetPixel(0,0,global_script.map.titleColor);
			global_script.tex3.Apply();
		}
		if (!global_script.tex4)
		{
			global_script.tex4 = new Texture2D(1,1);
			global_script.tex4.SetPixel(0,0,Color.yellow);
			global_script.tex4.Apply();
		}
		
		GUI.color = Color.white;
		
		if (key.keyCode == KeyCode.F5 && key.type == EventType.KeyDown) {request_map();}
		
		latlong_mouse = global_script.pixel_to_latlong(Vector2(key.mousePosition.x-(position.width/2)+offset_map.x,key.mousePosition.y-(position.height/2)-offset_map.y),global_script.map_latlong_center,zoom);
		latlong_center = global_script.pixel_to_latlong(Vector2(offset_map.x,-offset_map.y),global_script.map_latlong_center,zoom);
		
		if (global_script.map4 && global_script.map_zoom_old > 3 && !global_script.map.button_image_editor)
		{
			image_width = (zoom_pos4+1)*global_script.map4.width*4*2;
			image_height = (zoom_pos4+1)*global_script.map4.height*4*2;
			if (image_width < position.width*12)
			{
				EditorGUI.DrawPreviewTexture(Rect(((-offset_map4.x)-(zoom_pos4*((global_script.map4.width*2*2)+offset_map4.x))-(800*3))-(800-position.width/2),((offset_map4.y)-(zoom_pos4*((800*2*2)-offset_map4.y))-(2800))-(400-position.height/2),image_width,image_height),global_script.map4);
			} 
		}			
				
		if (global_script.map3 && global_script.map_zoom_old > 2 && !global_script.map.button_image_editor)
		{
			if ((global_script.map_zoom > global_script.map_zoom_old+2 && global_script.map_load4) && !global_script.map_load3){}
			else
			{
				image_width = (zoom_pos3+1)*global_script.map3.width*4;
				image_height = (zoom_pos3+1)*global_script.map3.height*4;
				if (image_width < position.width*12)
				{
					EditorGUI.DrawPreviewTexture(Rect(((-offset_map3.x)-(zoom_pos3*((global_script.map3.width*2)+offset_map3.x))-800)-(800-position.width/2),((offset_map3.y)-(zoom_pos3*((800*2)-offset_map3.y))-1200)-(400-position.height/2),image_width,image_height),global_script.map3);
				}
			}
		}
		
		/*
		if (script.map2)   
		{ 
			// EditorGUI.DrawPreviewTexture(Rect((-offset_map2.x)+(position.width/2)-(zoom_pos2*(offset_map2.x)),(offset_map2.y)-(zoom_pos2*((position.height/2)-offset_map2.y)),script.map2.width+(zoom_pos2*script.map2.width),script.map2.height+(zoom_pos2*script.map2.height)),script.map2);
		} 
		
		if (script.map)  
		{
			// EditorGUI.DrawPreviewTexture(Rect((-offset_map1.x)-(zoom_pos1*((position.width/2)+offset_map1.x)),(offset_map1.y)-(zoom_pos1*((script.map.height/2)-offset_map1.y)),script.map.width+(zoom_pos1*script.map.width),script.map.height+(zoom_pos1*script.map.height)),script.map);
		}
		*/
		if (global_script.map0)
		{
			if ((global_script.map_zoom > global_script.map_zoom_old+2 && global_script.map_load3) || (global_script.map_zoom > global_script.map_zoom_old+3 && global_script.map_load4) && !global_script.map_combine){}
			else
			{
				EditorGUI.DrawPreviewTexture(Rect(((-offset_map1.x)-(zoom_pos1*((global_script.map0.width/2)+offset_map1.x))-(800-position.width/2)),(offset_map1.y)-(zoom_pos1*((800/2)-offset_map1.y))-(400-position.height/2),global_script.map0.width+(zoom_pos1*global_script.map0.width),global_script.map0.height+(zoom_pos1*global_script.map0.height)),global_script.map0);
			}
		}
		//}
		// pixel3.x += -offset_map.x-(zoom_pos1*((40)+offset_map.x));//-(768-position.width/2);
		// pixel3.y += offset_map.y;//-(384-position.height/2);
		zoom = Mathf.Log((zoom_pos1+1),2)+global_script.map_zoom_old;			
		
		if (!global_script.map.button_image_editor) {
			for (var count_region: int = 0;count_region < global_script.map.region.Count;++count_region)
			{
				current_region = global_script.map.region[count_region];
			
			for (var count_area: int = 0;count_area < current_region.area.Count;++count_area)
			{
					if (current_region.area[count_area].created)
					{
						pixel3 = global_script.latlong_to_pixel(current_region.area[count_area].upper_left,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
						if (current_region.area[count_area].select == 1)
						{
							latlong_area = global_script.calc_latlong_area_rounded(current_region.area[count_area].upper_left,latlong_mouse,current_region.area[count_area].image_zoom,current_region.area[count_area].resolution,key.shift,8);
							// current_region.area[count_area].upper_left = latlong_area.latlong2;
							current_region.area[count_area].lower_right = latlong_area.latlong2;
							
						}
						
						current_region.area[count_area].tiles = global_script.calc_latlong_area_tiles(current_region.area[count_area].upper_left,current_region.area[count_area].lower_right,current_region.area[count_area].image_zoom,current_region.area[count_area].resolution);
						
						pixel4 = global_script.latlong_to_pixel(current_region.area[count_area].lower_right,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
						
						var width: float = pixel4.x-pixel3.x;
						var height: float = pixel4.y-pixel3.y;
						
						var color_center: Color;
						
						if (count_area == current_region.area_select && count_region == global_script.map.region_select)
						{
							if (!current_area.textureFormat) {set_terrain_default(current_area);}
							
							current_area.size = global_script.calc_latlong_area_size(current_area.upper_left,current_area.lower_right,current_area.center);
							
							color_center = Color.yellow;
							area_rounded = global_script.draw_latlong_raster(current_region.area[count_area].upper_left,current_region.area[count_area].lower_right,offset_map,current_region.area[count_area].image_zoom,zoom,current_region.area[count_area].resolution,Rect(0,0,position.width,position.height),Color(1,1,0,0.5),2);
							
							if (current_region.area[count_area].export_heightmap_active || current_region.area[count_area].export_image_active) {
								color_center = Color(1,1,1,1);
							}
							else if (current_region.area[count_area].export_heightmap_call || current_region.area[count_area].export_image_call) {color_center = Color(1,0.5,0,1);}
							
							global_script.DrawRect(Rect(-offset_map.x+pixel3.x,offset_map.y+pixel3.y,width,height),color_center,2,Rect(0,0,position.width,position.height));
							color_center = Color.yellow;
							
							if (key.button == 0 && key.isMouse && key.type == EventType.MouseDown)
							{
								if (current_area.start_tile_enabled) {
									if (Rect(pixel3.x,pixel3.y,width,height).Contains(key.mousePosition)) {
										current_area.start_tile.x = Mathf.Floor((key.mousePosition.x-pixel3.x)/(width/current_area.tiles.x));
										current_area.start_tile.y = Mathf.Floor((key.mousePosition.y-pixel3.y)/(height/current_area.tiles.y));
										
										current_area.start_tile_enabled = false;
										this.Repaint();
									}
								}
							}
							
							if (global_script.map.mode == 2 && !current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate)
							{
								if (!(export_image_area == current_area && (current_area.export_image_active || current_area.export_heightmap_active))) {
									this.Repaint();
									
									if (current_area.start_tile.x > current_area.tiles.x-1) {current_area.start_tile.x = current_area.tiles.x-1;}
									else if (current_area.start_tile.x < 0) {current_area.start_tile.x = 0;}
									if (current_area.start_tile.y > current_area.tiles.y-1) {current_area.start_tile.y = current_area.tiles.y-1;}
									else if (current_area.start_tile.y < 0) {current_area.start_tile.y = 0;}
									
									if (!current_area.resize)
									{
										// left
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x-10,pixel3.y+20,20,height-40),MouseCursor.ResizeHorizontal);     
										// right
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x+width-10,pixel3.y+20,20,height-40),MouseCursor.ResizeHorizontal);
										
										// middle
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x+(width/2)-20,pixel3.y+(height/2)-20,40,40),MouseCursor.Link);
										
										// top
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x+20,pixel3.y-10,width-40,20),MouseCursor.ResizeVertical);
										// bottom
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x+20,pixel3.y+height-10,width-40,20),MouseCursor.ResizeVertical);
										
										// topLeft
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x-20,pixel3.y-20,40,40),MouseCursor.ResizeUpLeft); 
										// topRight
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x+width-20,pixel3.y-20,40,40),MouseCursor.ResizeUpRight);     
										// bottomLeft
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x-20,pixel3.y-20+height,40,40),MouseCursor.ResizeUpRight); 
										// bottomRight
										EditorGUIUtility.AddCursorRect(Rect(pixel3.x+width-20,pixel3.y-20+height,40,40),MouseCursor.ResizeUpLeft); 
									}
									
									if (key.button == 0 && key.isMouse) {
										// current_area.image_changed = true;
						
										if (key.type == EventType.MouseDown)
										{
											if (!current_area.resize)
											{
												if (Rect(pixel3.x-10,pixel3.y+20,20,height-40).Contains(key.mousePosition))
												{
													current_area.resize_left = true;	
													current_area.resize = true;
												}
												else if (Rect(pixel3.x+width-10,pixel3.y+20,20,height-40).Contains(key.mousePosition))
												{
													current_area.resize_right = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x+20,pixel3.y-10,width-40,20).Contains(key.mousePosition))
												{
													current_area.resize_top = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x+20,pixel3.y+height-10,width-40,20).Contains(key.mousePosition))
												{
													current_area.resize_bottom = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x-20,pixel3.y-20,40,40).Contains(key.mousePosition))
												{
													current_area.resize_topLeft = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x+width-20,pixel3.y-20,40,40).Contains(key.mousePosition))
												{
													current_area.resize_topRight = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x-20,pixel3.y-20+height,40,40).Contains(key.mousePosition))
												{
													current_area.resize_bottomLeft = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x+width-20,pixel3.y-20+height,40,40).Contains(key.mousePosition))
												{
													current_area.resize_bottomRight = true;		
													current_area.resize = true;
												}
												else if (Rect(pixel3.x+(width/2)-20,pixel3.y+(height/2)-20,40,40).Contains(key.mousePosition))
												{
													current_area.resize_center = true;		
													current_area.resize = true;
												}
											}
										} 
										else if (key.type == EventType.MouseUp)
										{
											current_area.resize_left = false;		
											current_area.resize_right = false;
											current_area.resize_top = false;
											current_area.resize_bottom = false;
											current_area.resize_topLeft = false;
											current_area.resize_topRight = false;
											current_area.resize_bottomLeft = false;
											current_area.resize_bottomRight = false;
											current_area.resize_center = false;
											current_area.resize = false;
											
											global_script.map.elExt_check_assign = true; 
											requested_area = current_area;
											get_elevation_info(current_area.center);
										}
									}
									calc_heightmap_settings(current_area);
									if (!current_area.terrain_heightmap_resolution_changed) {calc_terrain_heightmap_resolution();}
									
									if (current_area.resize_left)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeHorizontal); 
										latlong_area = global_script.calc_latlong_area_rounded(latlong_class(current_area.upper_left.latitude,latlong_mouse.longitude),current_area.lower_right,current_area.image_zoom,current_area.resolution,key.shift,1);
										current_area.upper_left.longitude = latlong_area.latlong1.longitude;
									}
									else if (current_area.resize_right)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeHorizontal); 
										latlong_area = global_script.calc_latlong_area_rounded(current_area.upper_left,latlong_class(current_area.lower_right.latitude,latlong_mouse.longitude),current_area.image_zoom,current_area.resolution,key.shift,2);
										current_area.lower_right.longitude = latlong_area.latlong2.longitude;
									}
									else if (current_area.resize_top)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeVertical); 
										latlong_area = global_script.calc_latlong_area_rounded(latlong_class(latlong_mouse.latitude,current_area.upper_left.longitude),current_area.lower_right,current_area.image_zoom,current_area.resolution,key.shift,3);
										current_area.upper_left.latitude = latlong_area.latlong1.latitude;
									}
									else if (current_area.resize_bottom)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeVertical); 
										latlong_area = global_script.calc_latlong_area_rounded(current_area.upper_left,latlong_class(latlong_mouse.latitude,current_area.lower_right.longitude),current_area.image_zoom,current_area.resolution,key.shift,4);
										current_area.lower_right.latitude = latlong_area.latlong2.latitude;
									}
									else if (current_area.resize_topLeft)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeUpLeft); 
										latlong_area = global_script.calc_latlong_area_rounded(latlong_mouse,current_area.lower_right,current_area.image_zoom,current_area.resolution,key.shift,5);
										current_area.upper_left = latlong_area.latlong1;
									}
									else if (current_area.resize_topRight)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeUpRight); 
										latlong_area = global_script.calc_latlong_area_rounded(latlong_class(latlong_mouse.latitude,current_area.upper_left.longitude),latlong_class(current_area.lower_right.latitude,latlong_mouse.longitude),current_area.image_zoom,current_area.resolution,key.shift,6);
										current_area.upper_left.latitude = latlong_area.latlong1.latitude;
										current_area.lower_right.longitude = latlong_area.latlong2.longitude;
									}
									else if (current_area.resize_bottomLeft)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeUpRight); 
										latlong_area = global_script.calc_latlong_area_rounded(latlong_class(current_area.upper_left.latitude,latlong_mouse.longitude),latlong_class(latlong_mouse.latitude,current_area.lower_right.longitude),current_area.image_zoom,current_area.resolution,key.shift,7);
										current_area.upper_left.longitude = latlong_area.latlong1.longitude;
										current_area.lower_right.latitude = latlong_area.latlong2.latitude;
									}
									else if (current_area.resize_bottomRight)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.ResizeUpLeft); 
										latlong_area = global_script.calc_latlong_area_rounded(current_area.upper_left,latlong_mouse,current_area.image_zoom,current_area.resolution,key.shift,8);
										current_area.lower_right = latlong_area.latlong2;
									}
									else if (current_area.resize_center)
									{
										EditorGUIUtility.AddCursorRect(Rect(0,0,position.width,position.height),MouseCursor.Link); 
										global_script.calc_latlong_area_from_center(current_area,latlong_mouse,current_area.image_zoom,Vector2(current_area.resolution*current_area.tiles.x,current_area.resolution*current_area.tiles.y));
									}
								}
							}
							
							if (current_area.start_tile.x != 0 || current_area.start_tile.y != 0)
							{
								export_p1.x = pixel3.x+((width/current_area.tiles.x)*current_area.start_tile.x); 
								export_p1.y = pixel3.y+((height/current_area.tiles.y)*current_area.start_tile.y);
								width_p1 = width/current_area.tiles.x;
								height_p1 = height/current_area.tiles.y;
									
								global_script.DrawRect(Rect(-offset_map.x+export_p1.x,offset_map.y+export_p1.y,width_p1,height_p1),Color(1,0,0,1),2,Rect(0,0,position.width,position.height)); 
							}
						}
						else {
							
							if (current_region.area[count_area].export_heightmap_active || current_region.area[count_area].export_image_active) {color_center = Color(1,1,1,1);}
							else if (current_region.area[count_area].export_heightmap_call || current_region.area[count_area].export_image_call) {color_center = Color(1,0.5,0,1);}
							else {
								color_center = Color.green;
							}
							global_script.DrawRect(Rect(-offset_map.x+pixel3.x,offset_map.y+pixel3.y,width,height),color_center,2,Rect(0,0,position.width,position.height));
							color_center = Color.green;
						}
						
						current_region.area[count_area].center = global_script.calc_latlong_center(current_region.area[count_area].upper_left,current_region.area[count_area].lower_right,zoom,Vector2(position.width,position.height));
						
						var area_center: Vector2 = global_script.latlong_to_pixel(current_region.area[count_area].center,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
						
						var alpha_text: float = (width/175)-0.7;
						var alpha_text2: float = (height/175)-0.7;
						if (alpha_text > 1){alpha_text = 1;} 
						if (alpha_text2 > 1){alpha_text2 = 1;} 
						
						var text_zoom: float; 
						if (zoom > 12){text_zoom = zoom+((zoom-12)*3);} else {text_zoom = 12;}
						
						// km
						if (alpha_text/2 > 0) {
							global_script.drawText( (current_region.area[count_area].size.x/1000).ToString("F3")+" (Km)", Vector2(-offset_map.x+pixel3.x+(width/2), offset_map.y+pixel3.y), true, Color(1,0,0,alpha_text),Color(color_center.r,color_center.g,color_center.b,alpha_text/2), 0, text_zoom, false,2);
							global_script.drawText( (current_region.area[count_area].size.y/1000).ToString("F3")+" (Km)", Vector2(-offset_map.x+pixel3.x-30, offset_map.y+pixel3.y+(height/2)), true, Color(1,0,0,alpha_text2),Color(color_center.r,color_center.g,color_center.b,alpha_text2/2), -90, text_zoom, false,4);
						
							// draw tiles mousePos
							if (current_area.resize && !current_area.resize_center && count_area == current_region.area_select && count_region == global_script.map.region_select)
							{
								global_script.drawText(current_region.area[count_area].tiles.x.ToString()+"x"+current_region.area[count_area].tiles.y.ToString(),key.mousePosition+Vector2(10,20), true, Color(1,0,0,1),color_center+Color(0,0,0,-0.5), 0, 12, true,3);
							} 
							else {global_script.drawText(current_region.area[count_area].tiles.x.ToString()+"x"+current_region.area[count_area].tiles.y.ToString(),Vector2(pixel4.x-offset_map.x,pixel4.y+offset_map.y), true,Color(1,0,0,alpha_text),Color(color_center.r,color_center.g,color_center.b,alpha_text/2), 0, 12, true,5);}
						}
						
						// label
						var label_size: Vector2 = global_script.drawText( current_region.area[count_area].name, Vector2(-offset_map.x+pixel3.x, offset_map.y+pixel3.y), true, Color(1,0,0,1),color_center+Color(0,0,0,-0.5), 0, text_zoom, true,3);
						
						if (key.button == 0 && key.type == EventType.MouseDown)
						{
							if (Rect(-offset_map.x+pixel3.x,offset_map.y+pixel3.y-label_size.y,label_size.x,label_size.y).Contains(key.mousePosition)) 
							{
								global_script.map.region_select = count_region;
								global_script.map.region[count_region].area_select = count_area;
								this.Repaint();
							}
						}
						
						if (global_script.map.export_heightmap_active)
						{
							for (var count_elExt: int = 0;count_elExt < global_script.map.elExt.Count;++count_elExt)
							{
								export_p1 = global_script.latlong_to_pixel(global_script.map.elExt[count_elExt].latlong_area.latlong1,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
								export_p2 = global_script.latlong_to_pixel(global_script.map.elExt[count_elExt].latlong_area.latlong2,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
								width_p1 = export_p2.x-export_p1.x;
								height_p1 = export_p2.y-export_p1.y;
								
								if (global_script.map.elExt[count_elExt].error) {
									global_script.DrawRect(Rect(-offset_map.x+export_p1.x,offset_map.y+export_p1.y,width_p1,height_p1),Color(0.8,0,0,1),2,Rect(0,0,position.width,position.height)); 
								}
								else {
									global_script.DrawRect(Rect(-offset_map.x+export_p1.x,offset_map.y+export_p1.y,width_p1,height_p1),Color(0.95,0.62,0.04,1),2,Rect(0,0,position.width,position.height)); 
								}
							}
						}
						
						if (global_script.map.export_image_active)
						{
							for (var count_texExt: int = 0;count_texExt < global_script.map.texExt.Count;++count_texExt)
							{
								export_p1 = global_script.latlong_to_pixel(global_script.map.texExt[count_texExt].latlong_area.latlong1,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
								export_p2 = global_script.latlong_to_pixel(global_script.map.texExt[count_texExt].latlong_area.latlong2,global_script.map_latlong_center,zoom,Vector2(position.width,position.height));
								width_p1 = export_p2.x-export_p1.x;
								height_p1 = export_p2.y-export_p1.y;
								
								if (global_script.map.texExt[count_texExt].error)
								{
									global_script.DrawRect(Rect(-offset_map.x+export_p1.x,offset_map.y+export_p1.y,width_p1,height_p1),Color(0.8,0,0,1),2,Rect(0,0,position.width,position.height)); 
								}
								else
								{
									global_script.DrawRect(Rect(-offset_map.x+export_p1.x,offset_map.y+export_p1.y,width_p1,height_p1),Color.green,2,Rect(0,0,position.width,position.height)); 
								}
							}
						}
						
						// draw center
						Drawing_tc1.DrawLine(Vector2(area_center.x-10-offset_map.x+((7-(zoom/2.7))/1),area_center.y-10+offset_map.y+(7-(zoom/2.7))/1),Vector2(area_center.x+10-offset_map.x-((7-(zoom/2.7))/1),area_center.y+10+offset_map.y-((7-(zoom/2.7))/1)),color_center,1,false,Rect(0,0,position.width,position.height));
						Drawing_tc1.DrawLine(Vector2(area_center.x-10-offset_map.x+((7-(zoom/2.7))/1),area_center.y+10+offset_map.y-(7-(zoom/2.7))/1),Vector2(area_center.x+10-offset_map.x-((7-(zoom/2.7))/1),area_center.y-10+offset_map.y+((7-(zoom/2.7))/1)),color_center,1,false,Rect(0,0,position.width,position.height));
					}
				}
			}
		}
		
		current_region = global_script.map.region[global_script.map.region_select];
		
		if (current_region.area.Count > 0)
		{
			if (global_script.map.mode == 1)
			{
				if (key.button == 0 && key.isMouse && key.type == EventType.MouseDown)
				{
					// Debug.Log("Click!");
					if (!check_in_rect()) {
						if (current_area.select == 0)
						{
							current_area.upper_left = latlong_mouse;
							current_area.select = 1;
							current_area.created = true;
							requested_area = current_area;
							global_script.map.elExt_check_assign = true; 
							get_elevation_info(current_area.upper_left);
							current_area.start_tile_enabled = false;
							current_area.start_tile.x = 0;
							current_area.start_tile.y = 0;
						}
						else
						{
							pick_done();
						}
					}
				}
				
				if (key.button == 1)
				{
					current_area.select = 0;
					current_area.created = false;
					current_area.reset();
				}
				
				if (current_area.select == 1) {
					calc_heightmap_settings(current_area);
					if (!current_area.terrain_heightmap_resolution_changed) {calc_terrain_heightmap_resolution();}
					this.Repaint();}
			}
		}
		
		if (global_script.map.mode != 1 && key.button == 1 && key.type == EventType.MouseDown)
		{
			if (global_script.map.elExt_check_loaded)
			{
				get_elevation_info(latlong_mouse);
			}
		}
		
		// draw cross
		Drawing_tc1.DrawLine(Vector2(position.width/2,(position.height/2)-10),Vector2(position.width/2,(position.height/2)+10),Color.green,1,false,Rect(0,0,position.width,position.height));
		Drawing_tc1.DrawLine(Vector2((position.width/2)-10,position.height/2),Vector2((position.width/2)+10,position.height/2),Color.green,1,false,Rect(0,0,position.width,position.height));
		  
		GUI.color = global_script.map.titleColor;
		
		EditorGUI.DrawPreviewTexture(Rect(0,0,1422,24),global_script.tex2);
		
		// EditorGUI.DrawPreviewTexture(Rect(0,0,315,315),global_script.tex2);
		if (global_script.map.button_parameters || global_script.map.button_region || global_script.map.button_heightmap_export || global_script.map.button_image_export || global_script.map.button_settings || global_script.map.button_image_editor || global_script.map.button_update)
		{
			GUI.color = global_script.map.backgroundColor;
			if (global_script.map.button_image_editor) {
				EditorGUI.DrawPreviewTexture(Rect(0,23,guiWidth2+348,20),global_script.tex2);
			}
			else {
				EditorGUI.DrawPreviewTexture(Rect(0,23,guiWidth2,20),global_script.tex2);
			}
		}
		
		GUI.color = Color(1,1,1,global_script.map.alpha);
		
		// EditorGUI.LabelField(Rect(1152,384,315,20),script.map_long+", "+script.map_lat,EditorStyles.boldLabel);
		
		// EditorGUILayout.LabelField(texture.width.ToString()+"x"+texture.height.ToString(),EditorStyles.boldLabel);
		EditorGUILayout.BeginHorizontal(); 
		GUI.backgroundColor = Color(1,1,1,0.75);  
		
		if (global_script.map.button_parameters){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		
		if (GUILayout.Button(GUIContent("Map Parameters",button_map),GUILayout.Width(150),GUILayout.Height(19)))
		{
			global_script.map.button_parameters = !global_script.map.button_parameters;
		}
		
		if (global_script.map.button_region){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Regions",button_region),GUILayout.Width(120),GUILayout.Height(19)))
		{
			global_script.map.button_region = !global_script.map.button_region;
		}
		
		if (global_script.map.button_heightmap_export){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Heightmap Export",button_heightmap),GUILayout.Width(150),GUILayout.Height(19)))
		{
			global_script.map.button_heightmap_export = !global_script.map.button_heightmap_export;
		}
		
		if (global_script.map.button_image_export){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Image Export",button_image),GUILayout.Width(150),GUILayout.Height(19)))
		{
			global_script.map.button_image_export = !global_script.map.button_image_export;
		}
		
		if (global_script.map.button_image_editor){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 2){GUI.backgroundColor += Color(1,-0.5,-1);}
		if (GUILayout.Button(GUIContent("Image Editor",button_edit),GUILayout.Width(150),GUILayout.Height(19)))
		{
			global_script.map.button_image_editor = !global_script.map.button_image_editor;
			
			if (global_script.map.button_image_editor) {image_generate_begin();}
			else {
				if (global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 1) {
					global_script.map.preimage_edit.generate = false;
				}
				image_map2();
				request_map3();
				request_map4();
			}
		}
		
		if (global_script.map.button_image_combiner){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		
		if (global_script.map.button_settings){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Settings",button_settings),GUILayout.Width(120),GUILayout.Height(19)))
		{
			global_script.map.button_settings = !global_script.map.button_settings;
		}
		
		if (global_script.map.button_create_terrain){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Create Terrain",button_terrain),GUILayout.Width(150),GUILayout.Height(19)))
		{
			global_script.map.button_create_terrain = !global_script.map.button_create_terrain;
		}
		
		if (global_script.map.button_converter){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Converter",button_converter),GUILayout.Width(150),GUILayout.Height(19)))
		{
			global_script.map.button_converter = !global_script.map.button_converter;
		}
		
		if (global_script.map.button_help){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Help",button_help),GUILayout.Width(120),GUILayout.Height(19)))
		{
			global_script.map.button_help = !global_script.map.button_help;
		}
		
		if (global_script.map.button_update){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if (GUILayout.Button(GUIContent("Update",button_update),GUILayout.Width(120),GUILayout.Height(19)))
		{
			global_script.map.button_update = !global_script.map.button_update;
		}
		
		EditorGUILayout.EndHorizontal();
		
		GUI.backgroundColor = Color.white;
		
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.Toggle(global_script.map_load,GUILayout.Width(25));
		EditorGUILayout.Toggle(global_script.map_load2,GUILayout.Width(25));
		EditorGUILayout.Toggle(global_script.map_load3,GUILayout.Width(25));
		EditorGUILayout.Toggle(global_script.map_load4,GUILayout.Width(25));
		EditorGUILayout.EndHorizontal();
		gui_y += 41;
		
		wc_gui.y = 64;
		wc_gui.x = 0;
		wc_gui.column[0] = 3;
		wc_gui.column[1] = guiWidth1+3;
		
		if (global_script.map.button_image_editor)
		{	
			image_editor_rect = Rect(0,gui_y,guiWidth2+348,109+((global_script.map.preimage_edit.edit_color.Count*19)+(Convert.ToInt32(current_area.preimage_save_new)*36)+gui_height));
			drawGUIBox(image_editor_rect,"Combined Raw Image Editor",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			EditorGUI.LabelField(wc_gui.getRect(0,guiWidth1,18,false,true),"Color Rules",EditorStyles.boldLabel);
			wc_gui.y += 2;
			
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(0,4,25,15,true,false),"+",EditorStyles.miniButtonMid))
			{
				global_script.map.preimage_edit.edit_color.Add(new image_edit_class());
				if (key.shift) {
					global_script.map.preimage_edit.copy_color(global_script.map.preimage_edit.edit_color.Count-1,global_script.map.preimage_edit.edit_color.Count-2);
				}
				image_generate_begin();
			}
			if (GUI.Button(wc_gui.getRect(0,25,15,true,false),"-",EditorStyles.miniButtonMid) && global_script.map.preimage_edit.edit_color.Count > 1)
			{
				if (key.control) {
					#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
	        			Undo.RecordObject(global_script,"Erase Color Range");
	        		#else
	        			Undo.RegisterUndo(global_script,"Erase Color Range");
	        		#endif
					global_script.map.preimage_edit.edit_color.RemoveAt(global_script.map.preimage_edit.edit_color.Count-1);
					image_generate_begin();
					this.Repaint();
					return;
				}
				else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
				}
			}
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,2,25,19,true,false),"Act");
			GUI.color = Color.white;
			
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			global_script.map.preimage_edit.active = EditorGUI.Toggle(wc_gui.getRect(0,2,25,19,true,true),global_script.map.preimage_edit.active);
			
			for (var count_edit_color: int = 0;count_edit_color < global_script.map.preimage_edit.edit_color.Count;++count_edit_color) {
				wc_gui.x = 4;
			
				global_script.map.preimage_edit.edit_color[count_edit_color].color1_start = EditorGUI.ColorField (wc_gui.getRect(0,0,55,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].color1_start);
				global_script.map.preimage_edit.edit_color[count_edit_color].color1_end = EditorGUI.ColorField (wc_gui.getRect(0,4,55,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].color1_end);
				
				if (global_script.map.preimage_edit.edit_color[count_edit_color].output != image_output_enum.content) {
					global_script.map.preimage_edit.edit_color[count_edit_color].curve1 = EditorGUI.CurveField (wc_gui.getRect(0,4,50,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].curve1);
					global_script.map.preimage_edit.edit_color[count_edit_color].solid_color = EditorGUI.Toggle (wc_gui.getRect(0,6,25,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].solid_color);
					EditorGUI.LabelField(wc_gui.getRect(0,-4,20,18,true,false),"->",EditorStyles.boldLabel);
					global_script.map.preimage_edit.edit_color[count_edit_color].color2_start = EditorGUI.ColorField (wc_gui.getRect(0,4,55,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].color2_start);
					global_script.map.preimage_edit.edit_color[count_edit_color].color2_end = EditorGUI.ColorField (wc_gui.getRect(0,4,55,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].color2_end);
					global_script.map.preimage_edit.edit_color[count_edit_color].curve2 = EditorGUI.CurveField (wc_gui.getRect(0,4,50,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].curve2);
					global_script.map.preimage_edit.edit_color[count_edit_color].strength = EditorGUI.FloatField (wc_gui.getRect(0,4,50,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].strength);
					global_script.map.preimage_edit.edit_color[count_edit_color].output = EditorGUI.EnumPopup (wc_gui.getRect(0,4,75,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].output);
					global_script.map.preimage_edit.edit_color[count_edit_color].active = EditorGUI.Toggle (wc_gui.getRect(0,4,25,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].active);
				}
				else {
					global_script.map.preimage_edit.edit_color[count_edit_color].solid_color = EditorGUI.Toggle (wc_gui.getRect(0,6,25,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].solid_color);
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,-4,40,18,true,false),"Edge",EditorStyles.boldLabel);
					GUI.color = Color.white;
					global_script.map.preimage_edit.edit_color[count_edit_color].color2_start = EditorGUI.ColorField (wc_gui.getRect(0,4,55,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].color2_start);
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,2,50,18,true,false),"Radius",EditorStyles.boldLabel);
					GUI.color = Color.white;
					gui_changed_old = GUI.changed;
					GUI.changed = false;
					global_script.map.preimage_edit.radiusSelect = EditorGUI.IntField (wc_gui.getRect(0,4,48,18,true,false),global_script.map.preimage_edit.radiusSelect);
					if (GUI.changed) {
						if (global_script.map.preimage_edit.radiusSelect < 50) {global_script.map.preimage_edit.radiusSelect = 50;}
						else if (global_script.map.preimage_edit.radiusSelect > 2000) {global_script.map.preimage_edit.radiusSelect = 2000;}	
					}
					GUI.changed = gui_changed_old;
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,2,55,18,true,false),"Repeat",EditorStyles.boldLabel);
					GUI.color = Color.white;
					gui_changed_old = GUI.changed;
					GUI.changed = false;
					global_script.map.preimage_edit.repeatAmount = EditorGUI.IntField (wc_gui.getRect(0,4,35,18,true,false),global_script.map.preimage_edit.repeatAmount);
					if (GUI.changed) {
						if (global_script.map.preimage_edit.repeatAmount < 2) {global_script.map.preimage_edit.repeatAmount = 2;}
						else if (global_script.map.preimage_edit.repeatAmount > 20) {global_script.map.preimage_edit.repeatAmount = 20;}	
					}
					GUI.changed = gui_changed_old;
					global_script.map.preimage_edit.edit_color[count_edit_color].output = EditorGUI.EnumPopup (wc_gui.getRect(0,4,75,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].output);
					global_script.map.preimage_edit.edit_color[count_edit_color].active = EditorGUI.Toggle (wc_gui.getRect(0,4,25,18,true,false),global_script.map.preimage_edit.edit_color[count_edit_color].active);
				}
				
				if (GUI.Button(wc_gui.getRect(0,0,25,16,true,false),"<",EditorStyles.miniButtonMid))
				{
					if (count_edit_color > 0) {
						global_script.map.preimage_edit.swap_color(count_edit_color-1,count_edit_color);
						image_generate_begin();
						this.Repaint();
					}
				}
				if (GUI.Button(wc_gui.getRect(0,0,25,16,true,false),">",EditorStyles.miniButtonMid))
				{
					if (count_edit_color < global_script.map.preimage_edit.edit_color.Count-1) {
						global_script.map.preimage_edit.swap_color(count_edit_color,count_edit_color+1);
						image_generate_begin();
						this.Repaint();
					}
				}
				if (GUI.Button(wc_gui.getRect(0,0,25,16,true,false),"+",EditorStyles.miniButtonMid))
				{
					global_script.map.preimage_edit.edit_color.Insert(count_edit_color+1,new image_edit_class());
					if (key.shift) {
						global_script.map.preimage_edit.copy_color(count_edit_color+1,count_edit_color);
					}
					image_generate_begin();
				}
				if (GUI.Button(wc_gui.getRect(0,0,25,16,true,true),"-",EditorStyles.miniButtonMid) && global_script.map.preimage_edit.edit_color.Count > 1)
				{
					if (key.control) {
						#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
	        				Undo.RecordObject(global_script,"Erase Color Range");
	        			#else
	        				Undo.RegisterUndo(global_script,"Erase Color Range");
	        			#endif
						global_script.map.preimage_edit.edit_color.RemoveAt(count_edit_color);
						image_generate_begin();
						this.Repaint();
						return;
					}
					else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase"));
					}
				}
				wc_gui.y += 3;
			}
			
			if (GUI.changed) {
				image_generate_begin();
			}
			GUI.changed = gui_changed_old;
			
			wc_gui.x = 0;
			wc_gui.y += 3;
			
			/*
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,guiWidth1,19,false,false),"Export Active",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.preimage_export_active = EditorGUI.Toggle(wc_gui.getRect(1,25,18,false,true),current_area.preimage_export_active);
			*/
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,guiWidth1,19,false,false),"Save New",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.preimage_save_new = EditorGUI.Toggle(wc_gui.getRect(1,25,18,false,true),current_area.preimage_save_new);
			
			if (current_area.preimage_save_new) {
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,guiWidth1,19,false,false),"Export Path",EditorStyles.boldLabel);
				GUI.color = Color.white;
				EditorGUI.LabelField(wc_gui.getRect(1,438,19,true,false),GUIContent(current_area.preimage_path,current_area.preimage_path));
				GUI.color = Color.white;
				if (GUI.Button(wc_gui.getRect(1,64,18,true,false),"Change"))
				{
					path_old = current_area.preimage_path;
					if (!key.shift)
					{
						current_area.preimage_path = EditorUtility.OpenFolderPanel("Image Path",current_area.preimage_path,"");
						if (current_area.preimage_path.Length == 0) {
							current_area.preimage_path = path_old;
						}
						else {
							current_area.preimage_path_changed = true;
						}
					}
					else
					{
						current_area.preimage_path = Application.dataPath;
						current_area.preimage_path_changed = true;
					}
				}
				current_area.preimage_path_changed = EditorGUI.Toggle(wc_gui.getRect(1,4,25,19,false,true),current_area.preimage_path_changed);
				
				wc_gui.x = 0;
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,guiWidth1,19,false,false),"Image File",EditorStyles.boldLabel);
				GUI.color = Color.white;
				current_area.preimage_filename = EditorGUI.TextField(wc_gui.getRect(1,0,400,18,false,true),current_area.preimage_filename);
				
				/*
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,guiWidth1,19,false,false),"Import Settings",EditorStyles.boldLabel);
				GUI.color = Color.white;
				global_script.map.preimage_edit.import_settings = EditorGUI.Toggle(wc_gui.getRect(1,25,19,false,true),global_script.map.preimage_edit.import_settings);
				wc_gui.x = 0;
				*/
				// gui_y += 40;
			}
			wc_gui.y += 3;
			if (!global_script.map.preimage_edit.generate || global_script.map.preimage_edit.mode != 2) {
				if (GUI.Button(wc_gui.getRect(0,70,18,true,false),"Apply")) {
					save_global_settings();
										
					Application.runInBackground = true;
					convert_area = current_area;
					if (convert_textures_begin(convert_area))
					{
						// global_script.map.preimage_edit.loop = true;
						convert_area.preimage_count = 0;
						// global_script.map.preimage_edit.resolution = Vector2(4096,4096); 
					}
					return;
				}
			}
			else {
				if (GUI.Button(wc_gui.getRect(0,0,70,18,true,false),"Stop")) {
					Application.runInBackground = false;
					if (global_script.map.preimage_edit.inputRaw) {global_script.map.preimage_edit.inputBuffer.file.Close();}
					if (global_script.map.preimage_edit.outputRaw) {global_script.map.preimage_edit.outputBuffer.file.Close();}
					global_script.map.preimage_edit.loop = false;
					global_script.map.preimage_edit.generate = false; 
				}
			}
			if (!global_script.map.preimage_edit.loop_active) {GUI.backgroundColor = Color.red;}	
			if (GUI.Button(wc_gui.getRect(0,4,55,16,true,false),"Pause",EditorStyles.miniButtonMid)) {
				global_script.map.preimage_edit.loop_active = !global_script.map.preimage_edit.loop_active;
			}
			if (!(global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 2)) {
				if (GUI.Button(wc_gui.getRect(0,4,55,16,true,false),"Refresh",EditorStyles.miniButtonMid)) {
					global_script.map.preimage_edit.generate = false;
					image_generate_begin();
				}
			}
			
			GUI.backgroundColor = Color.white;
			// EditorGUI.LabelField(wc_gui.getRect(0,4,120,19,true,false),global_script.map.preimage_edit.y1.ToString(),EditorStyles.boldLabel);
			
			if (global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 2) {
				global_script.map.preimage_edit.progress = ((global_script.map.preimage_edit.repeat*1.0)/(global_script.map.preimage_edit.repeatAmount))+((((global_script.map.preimage_edit.tile.y*global_script.map.preimage_edit.inputBuffer.tiles.x)+global_script.map.preimage_edit.tile.x)*1.0)/(global_script.map.preimage_edit.inputBuffer.tiles.x*global_script.map.preimage_edit.inputBuffer.tiles.y*1.0))/((global_script.map.preimage_edit.repeatAmount*1.0));
				EditorGUI.ProgressBar(wc_gui.getRect(0,4,521,19,false,false),global_script.map.preimage_edit.progress,(global_script.map.preimage_edit.progress*100).ToString("F0")+"%");
			}
			if (global_script.map.preimage_edit.time < 0) {
				global_script.map.preimage_edit.time = 0;
			}
			
			EditorGUI.LabelField(wc_gui.getRect(0,6,70,19,false,false),sec_to_timeMin(global_script.map.preimage_edit.time,true));
			wc_gui.y += 19;
		}
		else {
			if (global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 2) {
				global_script.map.preimage_edit.progress = ((global_script.map.preimage_edit.repeat*1.0)/(global_script.map.preimage_edit.repeatAmount))+((((global_script.map.preimage_edit.tile.y*global_script.map.preimage_edit.inputBuffer.tiles.x)+global_script.map.preimage_edit.tile.x)*1.0)/(global_script.map.preimage_edit.inputBuffer.tiles.x*global_script.map.preimage_edit.inputBuffer.tiles.y*1.0))/((global_script.map.preimage_edit.repeatAmount*1.0));
				EditorGUI.ProgressBar(Rect(guiWidth2+15,23,490,19),global_script.map.preimage_edit.progress,(global_script.map.preimage_edit.progress*100).ToString("F0")+"%");
				EditorGUI.LabelField(Rect(guiWidth2+17,23,100,19),sec_to_timeMin(global_script.map.preimage_edit.time,true));
			}
		}
		
		if (global_script.map.button_update)
	    {
	    	wc_gui.x = 0;
			wc_gui.y = gui_y+20;
	    	update_rect = Rect(0,gui_y,guiWidth2,86+gui_height);
	    	drawGUIBox(update_rect,"Update",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
	    	// GUI.color = Color.green;
	    	// GUILayout.BeginVertical("Box");
	    	EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Updates",EditorStyles.boldLabel);
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; gui_changed_window = GUI.changed; GUI.changed = false;
			var update_select: int = read_check();
			GUI.color = Color.white;
			wc_gui.y += 2;
			update_select = EditorGUI.Popup(wc_gui.getRect(1,0,206,19,false,true),update_select,global_script.settings.update);	 
			if (GUI.changed)
			{
				write_check(update_select.ToString());
			}
			GUI.changed = gui_changed_old;
	    	
	    	wc_gui.x = 0;
	    	GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Current Version",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,80,19,false,false),"Final "+read_version().ToString("F3"));
			GUI.color = Color.white;
			if (info_window) {GUI.backgroundColor = Color.green;}
			if (GUI.Button(wc_gui.getRect(1,126,80,18,false,true),"Info"))
			{
				create_info_window();
			}
			GUI.backgroundColor = Color.white;
			
			wc_gui.x = 0;
			wc_gui.y += 1;
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Available Version",EditorStyles.boldLabel);
			if (global_script.settings.new_version == 0 || global_script.settings.wc_loading == 1){EditorGUI.LabelField(wc_gui.getRect(1,0,80,19,false,false),"---");}
			else {EditorGUI.LabelField(wc_gui.getRect(1,0,80,19,false,false),"Final "+global_script.settings.new_version.ToString("F3"));}
			if (global_script.settings.wc_loading == 1){EditorGUI.LabelField(wc_gui.getRect(1,120,70,16,false,false),"Checking...");}
			if (global_script.settings.wc_loading == 2){EditorGUI.LabelField(wc_gui.getRect(1,120,70,16,false,true),"Downloading...");}
			GUI.color = Color.white;
					
			if (global_script.settings.wc_loading == 0 || global_script.settings.wc_loading == 3)
			{
				if (!global_script.settings.update_version && !global_script.settings.update_version2)
				{
					if (GUI.Button(wc_gui.getRect(1,126,80,18,false,true),"Check Now"))
					{
						check_content_version();
					}
				}
			}
			if (global_script.settings.update_version && global_script.settings.wc_loading == 0)
			{
				if (GUI.Button(wc_gui.getRect(1,126,80,18,false,true),"Download"))
				{
					content_version();
					global_script.settings.update_version = false;
				}
			}
			else if (global_script.settings.update_version2)
			{
				if (GUI.Button(wc_gui.getRect(1,126,80,19,false,true),"Import"))
				{
					import_contents(Application.dataPath+"/TerrainComposer/Update/WorldComposer/WorldComposer.unitypackage",true);
				}
			}
		} 
		
		if (global_script.map.button_parameters)
		{	
			wc_gui.x = 0;
			wc_gui.y = gui_y+23;
	    
			if (global_script.map.key_edit){gui_height += 38+(global_script.map.bingKey.Count*19);}
			map_parameters_rect = Rect(0,gui_y,guiWidth2,118+gui_height);
			drawGUIBox(map_parameters_rect,"Map Parameters",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Map Type",EditorStyles.boldLabel);
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			global_script.map.type = EditorGUI.EnumPopup(wc_gui.getRect(1,0,150,19,true,false),global_script.map.type);
			if (GUI.changed)
			{
				request_map();
			}
			GUI.changed = gui_changed_old;
			
			if (GUI.Button(wc_gui.getRect(1,4,25,16,true,false),"K",EditorStyles.miniButtonMid))
			{
				global_script.map.key_edit = !global_script.map.key_edit;
				// if (!global_script.map.key_edit){tc_script.save_global_settings();}
			}
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (!global_script.map.active) {GUI.color = Color.red;}
			global_script.map.active = EditorGUI.Toggle(wc_gui.getRect(1,4,25,19,false,true),global_script.map.active);
			
			if (GUI.changed) {
				if (global_script.map.active) {
					request_map();
				}
			}
			GUI.changed = gui_changed_old;
			
			if (global_script.map.key_edit)
			{
				wc_gui.x = 0;
				if (GUI.Button(wc_gui.getRect(0,4,25,16,true,false),"+",EditorStyles.miniButtonMid))
				{
					global_script.map.bingKey.Add(new map_key_class());
					global_script.map.bingKey[global_script.map.bingKey.Count-1].key = "Enter your Key here";
					global_script.map.bingKey[global_script.map.bingKey.Count-1].reset();
				}
				if (GUI.Button(wc_gui.getRect(0,0,25,16,false,true),"-",EditorStyles.miniButtonMid) && global_script.map.bingKey.Count > 1)
				{
					if (key.control) {
						#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
	        				Undo.RecordObject(global_script,"Erase Bing Key");
		        		#else
		        			Undo.RegisterUndo(global_script,"Erase Bing Key");
		        		#endif
						global_script.map.bingKey.RemoveAt(global_script.map.bingKey.Count-1);
						this.Repaint();
						return;
					}
					else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase"));
					}
				}
				wc_gui.y += 3;
				for (var countKey: int = 0;countKey < global_script.map.bingKey.Count;++countKey)
				{
					wc_gui.x = 0;
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Bing Key "+countKey.ToString()+" ->",EditorStyles.boldLabel);
					GUI.color = Color.white;
					global_script.map.bingKey[countKey].key = EditorGUI.TextField(wc_gui.getRect(1,0,170,18,true,false),global_script.map.bingKey[countKey].key);
					wc_gui.y += 1;
					if (GUI.Button(wc_gui.getRect(1,4,25,16,false,true),"-",EditorStyles.miniButtonMid) && global_script.map.bingKey.Count > 1)
					{
						if (key.control) {
							#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
		        				Undo.RecordObject(global_script,"Erase Bing Key");
			        		#else
			        			Undo.RegisterUndo(global_script,"Erase Bing Key");
			        		#endif
							global_script.map.bingKey.RemoveAt(countKey);
							this.Repaint();
							return;
						}
						else {
							this.ShowNotification(GUIContent("Control click the '-' button to erase"));
						}
					}
					wc_gui.y += 3;
					
					GUI.color = global_script.map.backgroundColor; 
					EditorGUI.DrawPreviewTexture(Rect(guiWidth2+5,(countKey*19.9)+gui_y-96-(global_script.map.bingKey.Count*19),global_script.get_label_width("Key"+countKey.ToString()+" -> '"+global_script.map.bingKey[countKey].key+"'",true),17),global_script.tex2);
					GUI.color = Color.red;
					EditorGUI.LabelField(Rect(guiWidth2+5,(countKey*19.9)+gui_y-96-(global_script.map.bingKey.Count*19),position.width,50),"Key"+countKey.ToString()+" -> '"+global_script.map.bingKey[countKey].key+"'",EditorStyles.boldLabel);
					GUI.color = global_script.map.color;
				}
				GUI.color = global_script.map.backgroundColor; 
				EditorGUI.DrawPreviewTexture(Rect(guiWidth2+5,45,799,44),global_script.tex2);
				
				GUI.color = Color.red;
				EditorGUI.LabelField(Rect(guiWidth2+5,45,position.width,50),"You need to create a free Bing key. Read the WorldComposer manual in the TerrainComposer folder how to do this.\nIf you are in Webplayer build mode, read the troubleshooting in the WorldComposer manual to get it working.\nAfter you entered the key, press F5 to refresh. Then press the 'K' button in Map Parameters to hide the key and this text.",EditorStyles.boldLabel);
				GUI.color = global_script.map.color;
						
				wc_gui.x = 0;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Key Selected",EditorStyles.boldLabel);
				GUI.color = Color.white;
				global_script.map.bingKey_selected = EditorGUI.IntField(wc_gui.getRect(1,0,50,18,false,true),global_script.map.bingKey_selected);
				wc_gui.y += 1;
				if (global_script.map.bingKey_selected > global_script.map.bingKey.Count-1){global_script.map.bingKey_selected = global_script.map.bingKey.Count-1;}
				if (global_script.map.bingKey_selected < 0){global_script.map.bingKey_selected = 0;}
			}
			
			GUI.color = global_script.map.color;
			wc_gui.x = 0;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Latitude ",EditorStyles.boldLabel);
			
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (global_script.map.manual_edit) {
				GUI.color = Color.white;
				latlong_center.latitude = EditorGUI.FloatField(wc_gui.getRect(1,0,150,19,false,false),latlong_center.latitude);
			}
			else {
				EditorGUI.LabelField(wc_gui.getRect(1,0,150,19,false,false),latlong_center.latitude.ToString("F7"));
			}
			if (GUI.changed)
			{
				global_script.map_latlong_center = latlong_center;
			}
			GUI.changed = gui_changed_old;
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(0,guiWidth1+154,25,16,false,true),"E",EditorStyles.miniButtonMid))
			{
				global_script.map.manual_edit = !global_script.map.manual_edit;
			}
			wc_gui.y += 3;
			wc_gui.x = 0;
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Longitude ",EditorStyles.boldLabel); 
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (global_script.map.manual_edit) {
				GUI.color = Color.white;
				latlong_center.longitude = EditorGUI.FloatField(wc_gui.getRect(1,0,150,19,false,true),latlong_center.longitude);
			}
			else {
				EditorGUI.LabelField(wc_gui.getRect(1,0,150,19,false,true),latlong_center.longitude.ToString("F7"));
			}
			if (GUI.changed)
			{
				global_script.map_latlong_center = latlong_center;
			}
			GUI.changed = gui_changed_old;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Zoom ",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,400,19,false,true),zoom.ToString("F2")); 
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Mouse ",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,400,19,false,true),latlong_mouse.latitude.ToString("F5")+", "+latlong_mouse.longitude.ToString("F5"));
			// EditorGUILayout.LabelField("Mouse: "+key.mousePosition.x+", "+key.mousePosition.y,EditorStyles.boldLabel);
		
		// var map_latlong: Vector2 = tc_script.pixel_to_latlong(Vector2(0,0),Vector2(script.map_long_center,script.map_lat_center),script.map_zoom,768);
		// EditorGUILayout.LabelField("Pixel: "+pixel3);//+" Offset_map: "+offset_map3);//+" long: "+map_long2);
		// EditorGUILayout.LabelField("Width: "+script.map0.width+" Height: "+script.map0.height);//+" long: "+map_long2);
		}
		
		// Region
		if (global_script.map.button_region)
		{
			wc_gui.x = 0;
			wc_gui.y = gui_y+23;
			if (key.type == EventType.Repaint){global_script.map.region_rect = GUILayoutUtility.GetLastRect();}
			
			/*
			GUI.color = Color(1,1,1,global_script.map.alpha);
			EditorGUI.DrawPreviewTexture(Rect(0,22+ui,315,315),global_script.tex2);
			GUI.color = Color(0,0,1,0.2);
			EditorGUI.DrawPreviewTexture(Rect(global_script.map.region_rect.x,global_script.map.region_rect.y+6,316,19),global_script.tex2);
			
			GUI.color = global_script.map.color;
			GUI.backgroundColor = Color(1,1,1,0.9);
			EditorGUILayout.LabelField("Regions",EditorStyles.boldLabel,GUILayout.Width(guiWidth1));
			*/
			if (global_script.map.region_popup_edit){gui_height += 19;}
			
			regions_rect = Rect(0,gui_y,guiWidth2,63+gui_height);
			drawGUIBox(regions_rect,"Regions",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			// EditorGUILayout.LabelField("Region",EditorStyles.boldLabel,GUILayout.Width(guiWidth1));
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			global_script.map.region_select = EditorGUI.Popup(wc_gui.getRect(0,0,guiWidth1+126,19,true,false),global_script.map.region_select,global_script.map.region_popup);
			if (GUI.changed)
			{
				GUI.FocusControl("GoButton");
			}
			GUI.changed = gui_changed_old;
		
			if (GUI.Button(wc_gui.getRect(0,4,25,16,true,false),"E",EditorStyles.miniButtonMid))
			{
				global_script.map.region_popup_edit = !global_script.map.region_popup_edit;
				if (!global_script.map.region_popup_edit){GUI.FocusControl("GoButton");}
			}
			if (GUI.Button(wc_gui.getRect(0,0,25,16,true,false),"+",EditorStyles.miniButtonMid))
			{
				global_script.map.region.Add(new map_region_class(global_script.map.region.Count+1));
				global_script.map.region[global_script.map.region.Count-1].center = global_script.map_latlong_center;
				global_script.map.region_select = global_script.map.region.Count-1;
				global_script.map.make_region_popup(); 
				
				current_region = global_script.map.region[global_script.map.region.Count-1];
				
				add_area(current_region,0,"Untitled");
			}
			if (GUI.Button(wc_gui.getRect(0,0,25,16,false,true),"-",EditorStyles.miniButtonMid) && global_script.map.region.Count > 1)
			{
				if (key.control) {
					#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
        				Undo.RecordObject(global_script,"Region Erase");
	        		#else
	        			Undo.RegisterUndo(global_script,"Region Erase");
	        		#endif
					global_script.map.region.RemoveAt(global_script.map.region_select);
					if (global_script.map.region_select > 0){--global_script.map.region_select;}
					current_region = global_script.map.region[global_script.map.region_select];
					global_script.map.make_region_popup();
					this.Repaint();
					return;
				}
				else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
				}
			}
			wc_gui.x = 0;
			wc_gui.y += 3;
			
			if (global_script.map.disable_region_popup_edit && key.type == EventType.layout){global_script.map.disable_region_popup_edit = false;global_script.map.region_popup_edit = false;GUI.UnfocusWindow();this.Repaint();}
			
			if (global_script.map.region_popup_edit)
			{
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				GUI.color = Color.white;
				current_region.name = EditorGUI.TextField(wc_gui.getRect(0,2,210,19,false,true),current_region.name);
				
				if (GUI.changed)
				{
					if (current_region.name == String.Empty){current_region.name = "Untitled"+global_script.map.region_select.ToString();}
					global_script.map.make_region_popup();
				}
				GUI.changed = gui_changed_old;
				
				if (key.keyCode == KeyCode.Return){global_script.map.disable_region_popup_edit = true;GUI.FocusControl("GoButton");}
			}
			
			GUI.color = global_script.map.color;
			
			wc_gui.x = 0;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Lat/Long",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,122,19,true,false),current_region.center.latitude.ToString("F4")+", "+current_region.center.longitude.ToString("F4"));
			GUI.SetNextControlName ("GoButton");
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(1,8,30,16,true,false),"Go",EditorStyles.miniButtonMid))
			{
				stop_download();
				latlong_animate = current_region.center;
				animate_time_start = Time.realtimeSinceStartup;
				animate = true;
			}
			if (GUI.Button(wc_gui.getRect(1,0,45,16,false,true),"<Set>",EditorStyles.miniButtonMid) && key.shift)
			{
				current_region.center = global_script.map_latlong_center;
			}
			wc_gui.y += 30;
			
			/*
			GUI.color = global_script.map.color;
			if (key.type == EventType.Repaint){global_script.map.area_rect = GUILayoutUtility.GetLastRect();}
			
			GUI.color = Color(0,0,1,0.2);
			EditorGUI.DrawPreviewTexture(Rect(global_script.map.area_rect.x,global_script.map.area_rect.y+6,316,19),global_script.tex2);
			
			GUI.color = global_script.map.color;
			EditorGUILayout.LabelField("Areas",EditorStyles.boldLabel,GUILayout.Width(guiWidth1));
			*/
			if (global_script.map.area_popup_edit){gui_height = 19;}
			
			areas_rect = Rect(0,gui_y,guiWidth2+1,155+gui_height);
			if (current_area.manual_area) {areas_rect.height += 80;}
			drawGUIBox(areas_rect,"Areas",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			// EditorGUILayout.LabelField("Region",EditorStyles.boldLabel,GUILayout.Width(guiWidth1));
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			wc_gui.x = 0;
			current_region.area_select = EditorGUI.Popup(wc_gui.getRect(0,0,guiWidth1+126,19,true,false),current_region.area_select,current_region.area_popup);
			if (GUI.changed)
			{
				GUI.FocusControl("GoButton2");
			}
			GUI.changed = gui_changed_old;
			
			if (GUI.Button(wc_gui.getRect(0,4,25,16,true,false),"E",EditorStyles.miniButtonMid))
			{
				global_script.map.area_popup_edit = !global_script.map.area_popup_edit;
				if (!global_script.map.area_popup_edit){GUI.FocusControl("GoButton2");}
			}
			if (GUI.Button(wc_gui.getRect(0,0,25,16,true,false),"+",EditorStyles.miniButtonMid))
			{
				add_area(current_region,current_region.area.Count-1,"Untitled");
			}
			if (GUI.Button(wc_gui.getRect(0,0,25,16,false,true),"-",EditorStyles.miniButtonMid) && current_region.area.Count > 1)
			{
				if (key.control) {
					#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
        				Undo.RecordObject(global_script,"Area Erase");
	        		#else
	        			Undo.RegisterUndo(global_script,"Area Erase");
	        		#endif
					current_region.area.RemoveAt(current_region.area_select);
					if (current_region.area_select > 0){--current_region.area_select;}
					current_region.make_area_popup();
					this.Repaint();
					return;
				}
				else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
				}
			}
			wc_gui.y += 3;
			
			if (global_script.map.disable_area_popup_edit && key.type == EventType.layout){global_script.map.disable_area_popup_edit = false;global_script.map.area_popup_edit = false;GUI.UnfocusWindow();this.Repaint();}
			
			if (current_region.area.Count >  0)
			{
				if (global_script.map.area_popup_edit)
				{
					gui_changed_old = GUI.changed;
					GUI.changed = false;
					GUI.color = Color.white;
					wc_gui.x = 0;
					current_area.name = EditorGUI.TextField(wc_gui.getRect(0,2,210,19,false,true),current_area.name);
					
					if (GUI.changed)
					{
						if (current_area == String.Empty){current_area.name = "Untitled"+current_region.area_select.ToString();}
						current_region.make_area_popup();
						if (!current_area.preimage_path_changed) {
							current_area.preimage_path = current_area.name;
						}
						if (!current_area.export_heightmap_changed) {
							current_area.export_heightmap_filename = current_area.name;}
						if (!current_area.export_image_changed) {
							current_area.export_image_filename = current_area.name;}
						if (!current_area.export_terrain_changed) {
							current_area.terrain_asset_name = "_"+current_area.name;
							current_area.terrain_scene_name = current_area.name;}
					}
					GUI.changed = gui_changed_old;
					
					if (key.keyCode == KeyCode.Return){global_script.map.disable_area_popup_edit = true;GUI.FocusControl("GoButton2");}
					GUI.color = global_script.map.color;
				}
				wc_gui.x = 0;
			
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Center",EditorStyles.boldLabel);
				EditorGUI.LabelField(wc_gui.getRect(1,0,122,19,true,false),current_area.center.latitude.ToString("G6")+", "+current_area.center.longitude.ToString("G6"));
				GUI.SetNextControlName ("GoButton");
				GUI.color = Color.white;
				if (GUI.Button(wc_gui.getRect(1,8,30,16,true,false),"Go",EditorStyles.miniButtonMid))
				{
					if (current_area.tiles.x != 0 && current_area.tiles.y != 0) {
						stop_download();
						latlong_animate = current_area.center;
						animate_time_start = Time.realtimeSinceStartup;
						animate = true;
					}
					else {
						this.ShowNotification(GUIContent("The area is not created. Use the 'Pick' button to create an area"));
					}
				}
				if (GUI.Button(wc_gui.getRect(1,0,45,16,false,true),"<Set>",EditorStyles.miniButtonMid))
				{
					if (key.shift) {
						if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
							#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
		        				// Undo.RecordObject(global_script,"Set Center Area");
			        		#else
			        			// Undo.RegisterUndo(global_script,"Set Center Area");
			        		#endif
							global_script.calc_latlong_area_from_center(current_area,latlong_center,current_area.image_zoom,Vector2(current_area.resolution*current_area.tiles.x,current_area.resolution*current_area.tiles.y));
						}
						else {
							this.ShowNotification(GUIContent("It is not possible to relocate the area while exporting"));
						}
					}
					else {
						this.ShowNotification(GUIContent("Shift click <Set> to change center of area to center of current map view"));
					}
				}
				GUI.color = global_script.map.color;
				wc_gui.x = 0;
				wc_gui.y += 3;
				
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Upper Left",EditorStyles.boldLabel);
				EditorGUI.LabelField(wc_gui.getRect(1,0,guiWidth1,19,true,false),current_area.upper_left.latitude.ToString("G6")+", "+current_area.upper_left.longitude.ToString("G6"));
				GUI.color = Color.white;
				GUI.SetNextControlName ("GoButton");
				if (GUI.Button(wc_gui.getRect(1,10,30,16,true,false),"Go",EditorStyles.miniButtonMid))
				{
					if (current_area.tiles.x != 0 && current_area.tiles.y != 0) {
						stop_download();
						latlong_animate = current_area.upper_left;
						animate_time_start = Time.realtimeSinceStartup;
						animate = true;
					}
					else {
						this.ShowNotification(GUIContent("The area is not created. Use the 'Pick' button to create an area"));
					}
				}
				/*
				if (GUILayout.Button(">Set",EditorStyles.miniButtonMid,GUILayout.Width(40)))
				{
					if (!key.shift)
					{
						Undo.RegisterUndo(global_script,"Set Area Upper Left");
						script.calc_latlong1_area_from_center(current_area,latlong_center,19);
					}
					else
					{
						current_area.upper_left = latlong_center;
					}
				}
				*/
				if (global_script.map.mode == 1){GUI.backgroundColor = Color.green;}
				else if (current_area.tiles.x == 0 && current_area.tiles.y == 0) {
					GUI.backgroundColor = Color.red;
				}
				if (GUI.Button(wc_gui.getRect(1,0,45,16,false,true),"Pick",EditorStyles.miniButtonMid))
				{
					if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
						if (global_script.map.mode != 1)
						{
							global_script.map.mode = 1;
						}
						else
						{
							global_script.map.mode = 0;
							if (current_area.select == 1) {pick_done();}
						}
					}
					else {
						this.ShowNotification(GUIContent("It is not possible to repick the area while exporting"));
					}
				}
				
				wc_gui.x = 0;
				wc_gui.y += 3;
				GUI.backgroundColor = Color.white;
				
				if (current_area.manual_area) {
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Latitude",EditorStyles.boldLabel);
					GUI.color = Color.white;
					current_area.upper_left.latitude = EditorGUI.FloatField(wc_gui.getRect(1,0,160,19,false,true),current_area.upper_left.latitude);
					
					wc_gui.x = 0;
					
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Longitude",EditorStyles.boldLabel);
					GUI.color = Color.white;
					current_area.upper_left.longitude = EditorGUI.FloatField(wc_gui.getRect(1,0,160,19,false,true),current_area.upper_left.longitude);
				}
				
				wc_gui.x = 0;
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Lower Right",EditorStyles.boldLabel);
				if (current_area.lower_right.latitude > current_area.upper_left.latitude) {current_area.lower_right.latitude = current_area.upper_left.latitude;}
				if (current_area.lower_right.longitude < current_area.upper_left.longitude) {current_area.lower_right.longitude = current_area.upper_left.longitude;}
				EditorGUI.LabelField(wc_gui.getRect(1,0,122,19,true,false),current_area.lower_right.latitude.ToString("G6")+", "+current_area.lower_right.longitude.ToString("G6"));
				GUI.SetNextControlName ("GoButton");
				GUI.color = Color.white;
				if (GUI.Button(wc_gui.getRect(1,8,30,16,true,false),"Go",EditorStyles.miniButtonMid))
				{
					if (current_area.tiles.x != 0 && current_area.tiles.y != 0) {
						stop_download();
						latlong_animate = current_area.lower_right;
						animate_time_start = Time.realtimeSinceStartup;
						animate = true;
					}
					else {
						this.ShowNotification(GUIContent("The area is not created. Use the 'Pick' button to create an area"));
					}
				}
				/*
				if (GUILayout.Button(">Set",EditorStyles.miniButtonMid,GUILayout.Width(40)))
				{
					Undo.RegisterUndo(global_script,"Set Area Lower Right");
					if (!key.shift)
					{
						script.calc_latlong2_area_from_center(current_area,latlong_center,19);
					}
					else
					{
						current_area.lower_right = latlong_center;
					}
				}
				*/
				if (global_script.map.mode == 2){GUI.backgroundColor = Color.green;}
				if (GUI.Button(wc_gui.getRect(1,0,45,16,false,true),"Resize",EditorStyles.miniButtonMid))
				{
					if (global_script.map.mode == 1) {
						ShowNotification(new GUIContent("Fist click 1 more time in the WC map to select the lower right of your area."));
					}
					else if (current_area.created) 
					{
						if (global_script.map.mode == 2)
						{
							global_script.map.mode = 0;
						}
						else
						{
							global_script.map.mode = 2;
						}
					}
					else {ShowNotification(GUIContent("You need to create an area first with 'Pick'"));}
				}
				GUI.backgroundColor = Color.white;
				
				GUI.color = global_script.map.color;
				wc_gui.y += 3;	
				
				if (current_area.manual_area) {
					wc_gui.x = 0;
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Latitude",EditorStyles.boldLabel);
					GUI.color = Color.white;
					current_area.lower_right.latitude = EditorGUI.FloatField(wc_gui.getRect(1,0,160,16,false,true),current_area.lower_right.latitude);
					
					wc_gui.x = 0;
					
					GUI.color = global_script.map.color;
					EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Longitude",EditorStyles.boldLabel);
					GUI.color = Color.white;
					current_area.lower_right.longitude = EditorGUI.FloatField(wc_gui.getRect(1,0,160,19,false,true),current_area.lower_right.longitude);
				}
				
				GUI.color = global_script.map.color;
				wc_gui.x = 0;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Size",EditorStyles.boldLabel);
				EditorGUI.LabelField(wc_gui.getRect(1,0,152,19,true,false),(current_area.size.x/1000).ToString("F2")+"(km), "+(current_area.size.y/1000).ToString("F2")+"(km)");
				GUI.color = Color.white;
				if (GUI.Button(wc_gui.getRect(1,8,45,16,false,true),"Edit",EditorStyles.miniButtonMid)) 
				{
				
					current_area.manual_area = !current_area.manual_area;
				}
				
				wc_gui.x = 0;
				wc_gui.y += 3;
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Height Center",EditorStyles.boldLabel);
				EditorGUI.LabelField(wc_gui.getRect(1,0,150,19,false,true),current_area.center_height.ToString()+" (m)");
				
				wc_gui.x = 0;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Heightmap Data",EditorStyles.boldLabel);
				EditorGUI.LabelField(wc_gui.getRect(1,0,150,19,false,true),current_area.elevation_zoom.ToString()+" -> "+current_area.heightmap_scale.ToString("F2")+" (m/p)");
			}	
		}
			
		if (global_script.map.button_heightmap_export)
		{	
			wc_gui.x = 0;
			wc_gui.y = gui_y+23;
			heightmap_export_rect = Rect(0,gui_y,guiWidth2+1,184+gui_height);
			drawGUIBox(heightmap_export_rect,"Heightmap Export",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Heightmap Zoom",EditorStyles.boldLabel);
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			current_area.heightmap_zoom = EditorGUI.IntField(wc_gui.getRect(1,2,60,19,true,false),current_area.heightmap_zoom);
			if (GUI.Button(wc_gui.getRect(1,4,25,16,true,false),"+",EditorStyles.miniButtonMid))
			{
				if (!current_area.export_heightmap_active) {
					++current_area.heightmap_zoom;
					GUI.changed = true;
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change heightmap resolution while exporting"));
				}
			}
			if (GUI.Button(wc_gui.getRect(1,0,25,16,false,true),"-",EditorStyles.miniButtonMid))
			{
				if (!current_area.export_heightmap_active) {
					--current_area.heightmap_zoom;
					GUI.changed = true;
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change heightmap resolution while exporting"));
				}
			}
			wc_gui.y += 3;
			if (GUI.changed)
			{
				if (current_area.heightmap_zoom < 1){current_area.heightmap_zoom = 1;}
				else if (current_area.heightmap_zoom > current_area.elevation_zoom){current_area.heightmap_zoom = current_area.elevation_zoom;}
				calc_heightmap_settings(current_area);
				if (!current_area.terrain_heightmap_resolution_changed) {calc_terrain_heightmap_resolution();}
			}
			GUI.changed = gui_changed_old;
			wc_gui.x = 0;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Heightmap Size",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,400,19,false,true),current_area.heightmap_resolution.x.ToString()+"x"+current_area.heightmap_resolution.y.ToString()
				+"  ("+((current_area.heightmap_resolution.x*current_area.heightmap_resolution.y)/1024)+" threads)");
			wc_gui.x = 0;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Export Path",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,guiWidth1+19,19,true,false),GUIContent(current_area.export_heightmap_path,current_area.export_heightmap_path));
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(1,5,61,18,false,true),"Change"))
			{
				if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
					path_old = current_area.export_heightmap_path;
					if (!key.shift)
					{
						current_area.export_heightmap_path = EditorUtility.OpenFolderPanel("Export Heightmap Path",current_area.export_heightmap_path,"");
						if (current_area.export_heightmap_path.Length == 0) {
							current_area.export_heightmap_path = path_old;
						}
					}
					else
					{
						current_area.export_heightmap_path = Application.dataPath;
					}
					if (path_old != current_area.export_heightmap_path) {
						if (current_area.export_heightmap_path.IndexOf(Application.dataPath) == -1) {
							this.ShowNotification(GUIContent("The path should be inside your Unity project. Reselect your path."));
							current_area.export_heightmap_path = Application.dataPath;
						}
						
						current_area.export_heightmap_changed = true;
						if (!current_area.preimage_path_changed) {
							current_area.preimage_path = current_area.export_heightmap_path;
						}
						if (!current_area.export_image_changed) {
							current_area.export_image_path = current_area.export_heightmap_path;
						}
						if (!current_area.export_terrain_changed) {
							current_area.export_terrain_path = current_area.export_heightmap_path+"/Terrains";
						}
					}
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change an export folder while exporting."));
				}
			}
			if (global_script.map.path_display) {
				GUI.color = global_script.map.backgroundColor;
				EditorGUI.DrawPreviewTexture(Rect(heightmap_export_rect.x+guiWidth2+15,heightmap_export_rect.y+60,global_script.get_label_width(current_area.export_heightmap_path,true),20),global_script.tex2);
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(Rect(heightmap_export_rect.x+guiWidth2+15,heightmap_export_rect.y+61,global_script.get_label_width(current_area.export_heightmap_path,true),20),GUIContent(current_area.export_heightmap_path),EditorStyles.boldLabel);
			}
				
			GUI.color = global_script.map.color;
			wc_gui.x = 0;
			wc_gui.y += 1;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Offset",EditorStyles.boldLabel);
			wc_gui.x += guiWidth1-17;
			EditorGUI.LabelField(wc_gui.getRect(0,0,15,19,true,false),"X");
			GUI.color = Color.white;
			current_area.heightmap_offset_e.x = EditorGUI.IntField(wc_gui.getRect(0,4,45,18,true,false),current_area.heightmap_offset_e.x);
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,4,15,19,true,false),"Y"); 
			GUI.color = Color.white;
			current_area.heightmap_offset_e.y = EditorGUI.IntField(wc_gui.getRect(0,4,45,18,true,false),current_area.heightmap_offset_e.y);
			GUI.color = global_script.map.color;
			
			wc_gui.x = 0;
			wc_gui.y += 19;
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Heightmap File",EditorStyles.boldLabel);
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				current_area.export_heightmap_filename = EditorGUI.TextField(wc_gui.getRect(1,2,guiWidth1+21,18,true,false),current_area.export_heightmap_filename);
			}
			else {
				EditorGUI.TextField(wc_gui.getRect(1,2,guiWidth1+21,18,true,false),current_area.export_heightmap_filename);
			}
			if (GUI.changed) {
				current_area.export_heightmap_changed = true;
				
				if (!current_area.export_image_changed) {
					current_area.export_image_filename = current_area.export_heightmap_filename;}
				if (!current_area.terrain_name_changed) {
					current_area.terrain_asset_name = "_"+current_area.export_heightmap_filename;
					current_area.terrain_scene_name = current_area.export_heightmap_filename;
				}
			}
			GUI.changed = false;
			current_area.export_heightmap_changed = EditorGUI.Toggle(wc_gui.getRect(1,4,25,19,true,false),current_area.export_heightmap_changed);
			if (GUI.changed) {
				if (!current_area.export_heightmap_changed) {
					current_area.export_heightmap_path = current_area.export_image_path;
					current_area.export_heightmap_filename = current_area.export_image_filename;
				}
			}
			GUI.changed = gui_changed_old;
			if (global_script.map.path_display) {
				if (GUI.Button(wc_gui.getRect(1,8,25,16,false,true),"<",EditorStyles.miniButtonMid)) {
					global_script.map.path_display = false;
				}
			}
			else if (GUI.Button(wc_gui.getRect(1,8,25,16,false,true),">",EditorStyles.miniButtonMid)) {
				global_script.map.path_display = true;
			}
			wc_gui.x = 0;
			wc_gui.y += 3;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Threads",EditorStyles.boldLabel);
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				global_script.map.export_elExt = EditorGUI.IntField(wc_gui.getRect(1,2,60,18,false,true),global_script.map.export_elExt);
			}
			else {
				EditorGUI.IntField(wc_gui.getRect(1,2,60,18,false,true),global_script.map.export_elExt);
			}
			if (GUI.changed) {
				if (global_script.map.export_elExt < 1) {global_script.map.export_elExt = 1;}
				else if (global_script.map.export_elExt > 32) {global_script.map.export_elExt = 32;} 
			}
			GUI.changed = gui_changed_old;
			
			var button_text: String = "Export\n Heightmap";
			wc_gui.x = 0;
			wc_gui.y += 4;
			if (current_area.export_heightmap_active || current_area.export_heightmap_call){button_text = "Stop";}
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(0,0,guiWidth1,38,false,false),button_text))
			{
				if (current_area.tiles.x == 0 && current_area.tiles.y == 0) {
		    		this.ShowNotification(GUIContent("The area is not created. Use the 'Pick' button to create an area"));
		    		return;
		    	}
				if (!area_rounded) {
					this.ShowNotification(GUIContent("The area tiles are not rounded. Please resize the area"));
					global_script.map.mode = 2;
				}
				else {	
					if (key.shift) {
						save_global_settings();
					
						start_elevation_pull_region(current_region);
					}
					else if (key.control) {
						stop_elevation_pull_region(current_region);
					}
					else {
						save_global_settings();
					
						start_elevation_pull(current_region,current_area);
					}
				}
			}
			if (!global_script.map.export_heightmap_continue) {GUI.backgroundColor = Color.red;}	
			if (GUI.Button(wc_gui.getRect(1,3,45,16,true,false),"Pause",EditorStyles.miniButtonMid)) {
				global_script.map.export_heightmap_continue = !global_script.map.export_heightmap_continue;
			}
			GUI.backgroundColor = Color.white;
			
			GUI.color = Color.white;
			if (global_script.map.export_heightmap_active) {
				global_script.map.export_heightmap.progress = (((global_script.map.export_heightmap.tile.x*1.0)+(global_script.map.export_heightmap.tile.y*global_script.map.export_heightmap.tiles.x*1.0))/(global_script.map.export_heightmap.tiles.x*global_script.map.export_heightmap.tiles.y*1.0));
				EditorGUI.ProgressBar(wc_gui.getRect(1,4,153,19,false,false),global_script.map.export_heightmap.progress,(global_script.map.export_heightmap.progress*100).ToString("F0")+"%");
			}
			
			// GUI.color = global_script.map.color;
			if (global_script.map.export_heightmap_timeEnd-global_script.map.export_heightmap_timeStart < 0) {
				global_script.map.export_heightmap_timeEnd = global_script.map.export_heightmap_timeStart = 0;
			}
			EditorGUI.LabelField(wc_gui.getRect(1,4,100,19,false,true),sec_to_timeMin(global_script.map.export_heightmap_timeEnd-global_script.map.export_heightmap_timeStart,true));
			
		}
		
		if (current_area.image_changed) {
			if (!current_area.terrain_heightmap_resolution_changed) {calc_terrain_heightmap_resolution();}
			current_area.image_changed = false;
		}
						
		if (global_script.map.button_image_export)
		{	
			wc_gui.x = 0;
			wc_gui.y = gui_y+23;
			
			if (global_script.map.export_jpg){gui_height += 19;}
			if (global_script.map.export_raw){gui_height += 23;}
			image_export_rect = Rect(0,gui_y,guiWidth2+1,243+gui_height);
			drawGUIBox(image_export_rect,"Image Export",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Image Zoom",EditorStyles.boldLabel);
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			current_area.image_zoom = EditorGUI.IntField(wc_gui.getRect(1,2,60,18,true,false),current_area.image_zoom);
			if (GUI.Button(wc_gui.getRect(1,4,25,16,true,false),"+",EditorStyles.miniButtonMid))
			{
				if (!current_area.export_image_active && !combine_generate && !slice_generate) {
					++current_area.image_zoom;
					GUI.changed = true;
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change image zoom while exporting"));
				}
			}
			if (GUI.Button(wc_gui.getRect(1,0,25,16,true,true),"-",EditorStyles.miniButtonMid))
			{
				if (!current_area.export_image_active && !combine_generate && !slice_generate) {
					--current_area.image_zoom;
					GUI.changed = true;
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change image zoom while exporting"));
				}
			}
			if (GUI.changed)
			{
				if (current_area.image_zoom < 1){current_area.image_zoom = 1;}
				else if (current_area.image_zoom > 19){current_area.image_zoom = 19;}
				current_area.image_changed = true;
				check_area_resize();
			}
			GUI.changed = gui_changed_old;
			
			wc_gui.y += 3;
			wc_gui.x = 0;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Resolution",EditorStyles.boldLabel);
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			EditorGUI.LabelField(wc_gui.getRect(1,0,60,19,true,false),current_area.resolution.ToString());
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(1,6,25,16,true,false),"+",EditorStyles.miniButtonMid))
			{
				if (!current_area.export_image_active && !combine_generate && !slice_generate) {
					current_area.resolution *= 2;
					GUI.changed = true;
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change image resolution while exporting"));
				}
			}
			if (GUI.Button(wc_gui.getRect(1,0,25,16,false,true),"-",EditorStyles.miniButtonMid))
			{
				if (!current_area.export_image_active && !combine_generate && !slice_generate) {
					current_area.resolution /= 2;
					GUI.changed = true;
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change image resolution while exporting"));
				}
			}
			if (GUI.changed)
			{
				if (current_area.resolution < 512){current_area.resolution = 512;}
				
				check_area_resize();
			}
			GUI.changed = gui_changed_old;
			
			if (current_area.resolution > 4096 && (global_script.map.export_jpg || global_script.map.export_png)){current_area.resolution = 4096;}
			if (!current_area.maxTextureSize_changed) {
				if (current_area.resolution > 4096) {current_area.maxTextureSize = 4096;current_area.maxTextureSize_select = 7;}
				else {current_area.maxTextureSize = current_area.resolution;current_area.maxTextureSize_select = Mathf.Log(current_area.maxTextureSize,2)-5;}
			}
			
			wc_gui.y += 3;
			wc_gui.x = 0;
			
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Tiles",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.tiles.x = EditorGUI.IntField(wc_gui.getRect(1,2,45,18,true,false),current_area.tiles.x);
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(1,4,15,19,true,false),"*",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.tiles.y = EditorGUI.IntField(wc_gui.getRect(1,4,45,18,true,false),current_area.tiles.y);
			if (GUI.Button(wc_gui.getRect(1,5,22,16,false,false),"R",EditorStyles.miniButtonMid)) {
				current_area.start_tile.reset();
			}
			if (current_area.start_tile_enabled) {GUI.color = Color.green;}
			if (GUI.Button(wc_gui.getRect(1,32,58,16,false,true),"Start",EditorStyles.miniButtonMid))
			{
				current_area.start_tile_enabled = !current_area.start_tile_enabled;
			}
			
			wc_gui.y += 3;
			wc_gui.x = 0;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Offset",EditorStyles.boldLabel);
			wc_gui.x += guiWidth1-17;
			EditorGUI.LabelField(wc_gui.getRect(0,0,15,19,true,false),"X");
			GUI.color = Color.white;
			current_area.image_offset_e.x = EditorGUI.IntField(wc_gui.getRect(0,4,45,18,true,false),current_area.image_offset_e.x);
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,4,15,19,true,false),"Y"); 
			GUI.color = Color.white;
			current_area.image_offset_e.y = EditorGUI.IntField(wc_gui.getRect(0,4,45,18,true,false),current_area.image_offset_e.y);
			if (current_area.image_stop_one) {GUI.color = Color.red;} else {GUI.color = global_script.map.color;}
			EditorGUI.LabelField(wc_gui.getRect(0,29,30,19,true,false),"One");
			if (current_area.image_stop_one) {GUI.color = Color.red;} else {GUI.color = Color.white;}
			current_area.image_stop_one = EditorGUI.Toggle(wc_gui.getRect(0,4,25,19,true,false),current_area.image_stop_one);
			
			wc_gui.x = 0;
			wc_gui.y += 19;
			
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Image Size",EditorStyles.boldLabel);
			var area_size: Vector2;
			area_size.x = current_area.resolution*current_area.tiles.x;
			area_size.y = current_area.resolution*current_area.tiles.y;
			
			if (area_size.x != area_size_old.x || area_size.y != area_size_old.y) {
				if (global_script.map.warnings) {
					if ((area_size.x >= 16384 || area_size.y >= 16384) && (global_script.map.export_jpg || global_script.map.export_png)) {
						if (notify_text.IndexOf("The total") == -1) {
							if (notify_text.Length != 0) {notify_text += "\n\n";}
							notify_text += "The total image size is bigger then 15k, read page 4 in the manual to understand Unity's memory limitations.";
						}
					}
				}
			}
			
			area_size_old.x = area_size.x;
			area_size_old.y = area_size.y;
			
			if ((area_size.x >= 16384 && area_size.x <= 32768) || (area_size.y >= 16384 && area_size.y <= 32768)) {
				if (global_script.map.export_jpg || global_script.map.export_png) {
					GUI.color = Color.yellow;
				}
			}
			else if (area_size.x > 32768 || area_size.y > 32768) {
				if (global_script.map.export_jpg || global_script.map.export_png) {
					GUI.color = Color.red;
				}
			}
			EditorGUI.LabelField(wc_gui.getRect(1,0,300,19,false,true),(area_size.x).ToString()+"x"+(area_size.y).ToString()
				+"  ("+((area_size.x*area_size.y)/262144)+" threads)");
			
			wc_gui.x = 0;
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Export Path",EditorStyles.boldLabel);
			EditorGUI.LabelField(wc_gui.getRect(1,0,guiWidth1+19,19,true,false),GUIContent(current_area.export_image_path,current_area.export_image_path));
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(1,4,62,18,false,true),"Change"))
			{
				if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
					path_old = current_area.export_image_path;
					if (key.shift) {
						current_area.export_image_path = Application.dataPath;
					}
					else if (key.alt) {
						current_area.export_image_path = current_area.export_heightmap_path;
					}
					else {
						current_area.export_image_path = EditorUtility.OpenFolderPanel("Export image Path",current_area.export_image_path,"");
						if (current_area.export_image_path.Length == 0) {current_area.export_image_path = path_old;}
					}
					if (path_old != current_area.export_image_path) {
						if (current_area.preimage_path.IndexOf(Application.dataPath) == -1) {
							this.ShowNotification(GUIContent("The path should be inside your Unity project. Reselect your path."));
							current_area.export_image_path = Application.dataPath;
						}
						current_area.export_image_changed = true;
						if (!current_area.preimage_path_changed) {
							current_area.preimage_path = current_area.export_image_path;
						}
						if (!current_area.export_heightmap_changed) {
							current_area.export_heightmap_path = current_area.export_image_path;
						}
						if (!current_area.export_terrain_changed) {
							current_area.export_terrain_path = current_area.export_image_path+"/Terrains";
						}
					}
				}
				else {
					this.ShowNotification(GUIContent("It is not possible to change an export folder while exporting."));
				}
			}
			if (global_script.map.path_display) {
				GUI.color = global_script.map.backgroundColor;
				EditorGUI.DrawPreviewTexture(Rect(image_export_rect.x+guiWidth2+15,image_export_rect.y+117,global_script.get_label_width(current_area.export_image_path,true),20),global_script.tex2);
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(Rect(image_export_rect.x+guiWidth2+15,image_export_rect.y+118,global_script.get_label_width(current_area.export_image_path,true),20),GUIContent(current_area.export_image_path),EditorStyles.boldLabel);
			}
			
			wc_gui.x = 0;
			wc_gui.y += 1;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Image File",EditorStyles.boldLabel);
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				current_area.export_image_filename = EditorGUI.TextField(wc_gui.getRect(1,2,guiWidth1+21,18,true,false),current_area.export_image_filename);
			}
			else {
				EditorGUI.TextField(wc_gui.getRect(1,2,guiWidth1+21,18,true,false),current_area.export_image_filename);
			}
			if (GUI.changed) {
				current_area.export_image_changed = true;
				if (!current_area.export_heightmap_changed) {
					current_area.export_heightmap_filename = current_area.export_image_filename;}
				if (!current_area.export_terrain_changed) {
					current_area.terrain_asset_name = "_"+current_area.export_image_filename;
					current_area.terrain_scene_name = current_area.export_image_filename;
				}
			}
			GUI.changed = false;
			current_area.export_image_changed = EditorGUI.Toggle(wc_gui.getRect(1,4,25,19,true,false),current_area.export_image_changed);
			if (GUI.changed) {
				if (!current_area.export_image_changed) {
					current_area.export_image_path = current_area.export_heightmap_path;
					current_area.export_image_filename = current_area.export_heightmap_filename;
				}
			}
			GUI.changed = gui_changed_old;
			if (global_script.map.path_display) {
				if (GUI.Button(wc_gui.getRect(1,8,25,16,false,true),"<",EditorStyles.miniButtonMid)) {
					global_script.map.path_display = false;
				}
			}
			else if (GUI.Button(wc_gui.getRect(1,8,25,16,false,true),">",EditorStyles.miniButtonMid)) {
				global_script.map.path_display = true;
			}
			GUI.color = global_script.map.color;
			
			wc_gui.y += 3;
			wc_gui.x = 0;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Export World File",EditorStyles.boldLabel);
			GUI.color = Color.white;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				current_area.export_image_world_file = EditorGUI.Toggle(wc_gui.getRect(1,2,25,19,false,true),current_area.export_image_world_file);
			}
			else {
				EditorGUI.Toggle(wc_gui.getRect(1,2,25,19,false,true),current_area.export_image_world_file);
			}
			
			wc_gui.x = 0;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Threads",EditorStyles.boldLabel);
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				global_script.map.export_texExt = EditorGUI.IntField(wc_gui.getRect(1,2,60,18,false,true),global_script.map.export_texExt);
			}
			else {
				EditorGUI.IntField(wc_gui.getRect(1,2,60,18,false,true),global_script.map.export_texExt);
			}
			if (GUI.changed) {
				if (global_script.map.export_texExt < 1) {global_script.map.export_texExt = 1;}
				else if (global_script.map.export_texExt > 8) {global_script.map.export_texExt = 8;}
			}
			GUI.changed = gui_changed_old;
			
			// wc_gui.y += 1;
			// wc_gui.x = 0;
			
			/*
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Import Settings",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.export_image_import_settings = EditorGUI.Toggle(wc_gui.getRect(1,2,25,19,true,false),current_area.export_image_import_settings);
			if (apply_import_settings) {
				GUI.color = Color.red;
				EditorGUI.LabelField(wc_gui.getRect(1,4,30,19,false,false),((create_area.tiles.x*create_area.tiles.y)-import_settings_count).ToString());
			}
			*/
			current_area.export_image_import_settings = false;
			
			wc_gui.y += 4;
			wc_gui.x = 0;
			
			// Export image button
			button_text = "Export\n Images";
							
			if (current_area.export_image_active || current_area.export_image_call){button_text = "Stop";}
			GUI.color = Color.white;
			if (GUI.Button(wc_gui.getRect(0,0,guiWidth1,38,true,false),button_text))
			{
				if (global_script.map.export_jpg && global_script.map.export_raw) {
					this.ShowNotification(GUIContent("The Jpg and Raw are selected. This mode can only be used to slice the raw combined image into Jpg images. Read page 10 in the WorldComposer manual about this."));
				}
				else {
					if (current_area.tiles.x == 0 && current_area.tiles.y == 0) {
		    			this.ShowNotification(GUIContent("The area is not created. Use the 'Pick' button to create an area"));
		    			return;
		    		}
					if (!check_area_resize()) {
						if (key.shift) {	 
							save_global_settings();
					
		    				start_image_pull_region(current_region);
						}
						else if (key.control) {
							stop_image_pull_region(current_region);
						}
						else {
							save_global_settings();
					
							start_image_pull(current_region,current_area);
						}
					}
				}
			}
			EditorGUILayout.BeginVertical();
			if (!global_script.map.export_image_continue) {GUI.backgroundColor = Color.red;}	
			if (GUI.Button(wc_gui.getRect(0,4,45,16,false,false),"Pause",EditorStyles.miniButtonMid)) {
				global_script.map.export_image_continue = !global_script.map.export_image_continue;
			}
			GUI.backgroundColor = Color.white;
			GUI.color = Color.white;
			if (global_script.map.export_image_active) {
				global_script.map.export_image.progress = (((global_script.map.export_image.tile.x*1.0)+(global_script.map.export_image.tile.y*global_script.map.export_image.tiles.x*1.0))/(global_script.map.export_image.tiles.x*global_script.map.export_image.tiles.y*1.0));
				EditorGUI.ProgressBar(wc_gui.getRect(0,53,153,19,false,false),global_script.map.export_image.progress,(global_script.map.export_image.progress*100).ToString("F0")+"%");
			}
			if (global_script.map.export_image_timeEnd-global_script.map.export_image_timeStart < 0) {
				global_script.map.export_image_timeEnd = global_script.map.export_image_timeStart = 0;
			}
			
			EditorGUI.LabelField(wc_gui.getRect(0,53,100,19,false,true),sec_to_timeMin(global_script.map.export_image_timeEnd-global_script.map.export_image_timeStart,true));
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,4,30,19,true,false),"Jpg");
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white; 
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				global_script.map.export_jpg = EditorGUI.Toggle(wc_gui.getRect(0,4,25,19,true,false),global_script.map.export_jpg);
			}
			else {
				EditorGUI.Toggle(wc_gui.getRect(0,4,25,19,true,false),global_script.map.export_jpg);
			}
			if (GUI.changed)
			{
				if (!global_script.map.export_jpg && !global_script.map.export_raw)
				{
					if (!global_script.map.export_png){global_script.map.export_png = true;}
				}
			}
			GUI.changed = gui_changed_old;
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,10,30,19,true,false),"Png");
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				global_script.map.export_png = EditorGUI.Toggle(wc_gui.getRect(0,4,24,19,true,false),global_script.map.export_png);
			}
			else {
				EditorGUI.Toggle(wc_gui.getRect(0,4,24,19,true,false),global_script.map.export_png);
			}
			if (GUI.changed)
			{
				if (!global_script.map.export_png && !global_script.map.export_raw)
				{
					if (!global_script.map.export_jpg){global_script.map.export_jpg = true;}
				}
				
				if (global_script.map.export_png && global_script.map.export_raw) {
					global_script.map.export_raw = false;
				}
			}
			GUI.changed = gui_changed_old;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(wc_gui.getRect(0,10,30,19,true,false),"Raw");
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			if (!current_area.export_heightmap_active && !current_area.export_image_active && !combine_generate && !slice_generate) {
				global_script.map.export_raw = EditorGUI.Toggle(wc_gui.getRect(0,4,25,19,true,true),global_script.map.export_raw);
			}
			else {
				EditorGUI.Toggle(wc_gui.getRect(0,4,25,19,true,true),global_script.map.export_raw);
			}
			if (GUI.changed)
			{
				if (!global_script.map.export_raw)
				{
					if (!global_script.map.export_jpg){global_script.map.export_jpg = true;}
				}
				else {
					global_script.map.export_png = false;
				}
			}
			GUI.changed = gui_changed_old;
			
			wc_gui.x = 0;
			wc_gui.y += 3;
			
			GUI.color = global_script.map.color;
			
			if (global_script.map.export_jpg)
			{
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Jpeg Quality",EditorStyles.boldLabel);
				GUI.color = Color.white;
				// GUI.backgroundColor = Color.white;
				global_script.map.export_jpg_quality = EditorGUI.Slider(wc_gui.getRect(1,4,guiWidth1+80,19,false,true),global_script.map.export_jpg_quality,0,100);
			}
			
			wc_gui.y += 3;
			if (global_script.map.export_raw)
			{
				GUI.color = Color.white;
				if (!combine_generate && !slice_generate) {
					if (global_script.map.export_jpg)
					{
						if (GUI.Button(wc_gui.getRect(0,0,120,19,false,true),"Slice Images")) 
						{
							slice_textures_begin(current_area,current_area.export_image_path,current_area.export_image_filename);
						}
					}
					else if (GUI.Button(wc_gui.getRect(0,0,120,19,false,true),"Combine Images"))
					{
						combine_textures_begin(current_area,current_area.export_image_path,current_area.export_image_filename);
					}
				}
				else {
					if (GUI.Button(wc_gui.getRect(0,0,120,19,true,false),"Stop")) {
						combine_generate = false;
						slice_generate = false;
						if (combine_export_file) {
							combine_import_file.Close();
						}
						if (combine_export_file) {
							combine_export_file.Close();
						}
						Application.runInBackground = false;
					}
					combine_progress = (((combine_y*combine_area.tiles.x)+combine_x)*1.0)/(combine_area.tiles.x*combine_area.tiles.y*1.0);//+((combine_y1*1.0)/(combine_area.resolution*1.0));
					EditorGUI.ProgressBar(wc_gui.getRect(0,4,206,19,false,true),combine_progress,(combine_progress*100).ToString("F0")+"%");
				}
			}
			
		}
		
		if (global_script.map.button_settings)
		{	
				wc_gui.x = 0;
				wc_gui.y = gui_y+23;
				
				settings_rect = Rect(0,gui_y,guiWidth2+1,179+gui_height);
				drawGUIBox(settings_rect,"Settings",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
				
				if (global_script.map.bingKey[global_script.map.bingKey_selected].pulls > 45000){GUI.color = Color.red;} else {GUI.color = global_script.map.color;}
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Called Threads",EditorStyles.boldLabel);
				
				EditorGUI.LabelField(wc_gui.getRect(1,0,150,19,true,false),"Key"+global_script.map.bingKey_selected+" -> "+global_script.map.bingKey[global_script.map.bingKey_selected].pulls.ToString()+" ("+calc_24_hours()+")");
				GUI.color = Color.white;
				if (GUI.Button(wc_gui.getRect(1,4,50,18,false,true),"Reset")) {
					global_script.map.bingKey[global_script.map.bingKey_selected].reset();
				}
				
				wc_gui.y += 1;
				wc_gui.x = 0;
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Reset Exports",EditorStyles.boldLabel);
				GUI.color = Color.white;
				if (GUI.Button(wc_gui.getRect(1,154,50,18,false,true),"Reset")) {
					reset_exports();
				}
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Memory Warning",EditorStyles.boldLabel);
				GUI.color = Color.white;
				global_script.map.warnings = EditorGUI.Toggle(wc_gui.getRect(1,2,guiWidth1+25,19,false,true),global_script.map.warnings);
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Track Tiles",EditorStyles.boldLabel);
				GUI.color = Color.white;
				global_script.map.track_tile = EditorGUI.Toggle(wc_gui.getRect(1,2,guiWidth1+25,19,false,true),global_script.map.track_tile);
				
				wc_gui.y += 3;
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Mouse Sensivity",EditorStyles.boldLabel);
				GUI.color = Color.white;
				// GUI.backgroundColor = Color.white;
				global_script.map.mouse_sensivity = EditorGUI.Slider(wc_gui.getRect(1,2,guiWidth1+84,19,false,true),global_script.map.mouse_sensivity,1,10);
				
				wc_gui.x = 0;
			
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Title Color",EditorStyles.boldLabel);
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				GUI.color = Color.white;
				global_script.map.titleColor = EditorGUI.ColorField(wc_gui.getRect(1,0,50,17,false,false),global_script.map.titleColor);
				if (GUI.changed) {
					global_script.tex3.SetPixel(0,0,global_script.map.titleColor);
					global_script.tex3.Apply();
				}
				GUI.changed = gui_changed_old;
				
				wc_gui.x = 0;
				wc_gui.y += 19;
				
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Background Color",EditorStyles.boldLabel);
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				GUI.color = Color.white;
				global_script.map.backgroundColor = EditorGUI.ColorField(wc_gui.getRect(1,0,50,17,false,false),global_script.map.backgroundColor);
				if (GUI.changed) {
					global_script.tex2.SetPixel(0,0,global_script.map.backgroundColor);
					global_script.tex2.Apply();
				}
				
				wc_gui.x = 0;
				wc_gui.y += 19;
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(wc_gui.getRect(0,0,guiWidth1,19,false,false),"Font Color",EditorStyles.boldLabel);
				GUI.color = Color.white;
				global_script.map.color = EditorGUI.ColorField(wc_gui.getRect(1,0,50,17,false,false),global_script.map.color);
		}
		
		if (global_script.map.button_image_editor) {
			gui_y2 += 129+(global_script.map.preimage_edit.edit_color.Count*18);
			if (current_area.preimage_save_new) {gui_y2 += 60;}
		}
		if (global_script.map.button_help) {keyHelp();gui_y2+= 130;}
		screen_rect2 = Rect(0,0,0,0);
		
		if (global_script.map.button_converter) {
			converter_rect = Rect(guiWidth2+15,42+gui_y2,490,122);
			drawGUIBox(converter_rect,"Converter",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			EditorGUI.LabelField(Rect(guiWidth2+14,64+gui_y2,200,20),"Source ascii heightmap",EditorStyles.boldLabel);
			if (global_script.map.path_display) {
				GUI.color = global_script.map.backgroundColor; 
				EditorGUI.DrawPreviewTexture(Rect(guiWidth2+529,64+gui_y2,global_script.get_label_width(current_area.converter_source_path_full,true),20),global_script.tex2);
				GUI.color = Color.green;
				EditorGUI.LabelField(Rect(guiWidth2+528,65+gui_y2,global_script.get_label_width(current_area.converter_source_path_full,true),20),GUIContent(current_area.converter_source_path_full),EditorStyles.boldLabel);
			}
			EditorGUI.LabelField(Rect(guiWidth2+204,64+gui_y2,220,20),GUIContent(current_area.converter_source_path_full,current_area.converter_source_path_full)); 
			GUI.color = Color.white;
			
			if (GUI.Button(Rect(guiWidth2+428,64+gui_y2,70,18),"Change")) {
				path_old = current_area.converter_source_path_full;
				if (!key.shift)
				{
					current_area.converter_source_path_full = EditorUtility.OpenFilePanel("Source Ascii heightmap",current_area.converter_source_path_full,"asc");
					if (current_area.converter_source_path_full.Length == 0) {current_area.converter_source_path_full = path_old;}
					else {
						current_area.converter_destination_path_full = current_area.converter_source_path_full.Replace(".asc",".raw");
					}
				}
				else
				{
					current_area.converter_source_path = Application.dataPath;
				}
			}
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(Rect(guiWidth2+14,83+gui_y2,200,20),"Destination raw heightmap",EditorStyles.boldLabel);
			if (global_script.map.path_display) {
				GUI.color = global_script.map.backgroundColor; 
				EditorGUI.DrawPreviewTexture(Rect(guiWidth2+529,83+gui_y2,global_script.get_label_width(current_area.converter_destination_path_full,true),20),global_script.tex2);
				GUI.color = Color.green;
				EditorGUI.LabelField(Rect(guiWidth2+528,83+gui_y2,global_script.get_label_width(current_area.converter_destination_path_full,true),20),GUIContent(current_area.converter_destination_path_full),EditorStyles.boldLabel);
			}
			EditorGUI.LabelField(Rect(guiWidth2+204,83+gui_y2,220,20),GUIContent(current_area.converter_destination_path_full,current_area.converter_destination_path_full)); 
			GUI.color = Color.white;
			if (GUI.Button(Rect(guiWidth2+428,83+gui_y2,70,18),"Change")) {
				path_old = current_area.converter_destination_path_full;
				if (!key.shift)
				{
					var name_index: int = current_area.converter_source_path_full.LastIndexOf("/");
					var default_name: String = current_area.converter_source_path_full.Substring(name_index+1);
					default_name = default_name.Replace(".asc",".raw");
					current_area.converter_destination_path_full = EditorUtility.SaveFilePanel("Destination raw heightmap",current_area.converter_source_path_full,default_name,"raw");
					if (current_area.converter_destination_path_full.Length == 0) {current_area.converter_destination_path_full = path_old;}
				}
				else
				{
					current_area.converter_source_path = Application.dataPath;
				}
			}
			if (global_script.map.path_display) {
				if (GUI.Button(Rect(guiWidth2+471,104+gui_y2,25,15),"<",EditorStyles.miniButtonMid)) { 
					global_script.map.path_display = false;
				}
			}
			else if (GUI.Button(Rect(guiWidth2+471,104+gui_y2,25,15),">",EditorStyles.miniButtonMid)) {
				global_script.map.path_display = true;
			}
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+14,102+gui_y2,200,20),"Heightmap Height",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.converter_height = EditorGUI.FloatField(Rect(guiWidth2+204,102+gui_y2,200,17),current_area.converter_height);
			
			
			if (GUI.Button(Rect(guiWidth2+18,121+gui_y2,130,36),"Convert")) {
				if (current_area.converter_source_path_full.Length == 0) {this.ShowNotification(GUIContent("Choose a source ascii file"));return;}
				if (current_area.converter_destination_path_full.Length == 0) {this.ShowNotification(GUIContent("Choose a destination raw file"));return;}
				asc_convert_to_raw (current_area.converter_source_path_full,current_area.converter_destination_path_full);
			}	
			
			gui_y2 += 124;	 
		}
		
		if (global_script.map.button_create_terrain) {
			var tc_height: int = 0;
			var import_height: int = 0;
			
			if (current_area.import_heightmap) {import_height += 19;}
			if (terraincomposer) {
				tc_height += 19;
			}
			tc_height += 43; 
			
			create_terrain_rect = Rect(guiWidth2+15,42+gui_y2,490,320+tc_height+import_height);
			drawGUIBox(create_terrain_rect,"Create Terrain",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
			
			EditorGUI.LabelField(Rect(guiWidth2+19,64+gui_y2,200,20),"Asset Path",EditorStyles.boldLabel);
			if (global_script.map.path_display) {
				GUI.color = global_script.map.backgroundColor; 
				EditorGUI.DrawPreviewTexture(Rect(guiWidth2+529,64+gui_y2,global_script.get_label_width(current_area.export_terrain_path,true),20),global_script.tex2);
				GUI.color = global_script.map.color;
				EditorGUI.LabelField(Rect(guiWidth2+528,65+gui_y2,global_script.get_label_width(current_area.export_terrain_path,true),20),GUIContent(current_area.export_terrain_path),EditorStyles.boldLabel);
			}
			EditorGUI.LabelField(Rect(guiWidth2+204,64+gui_y2,200,20),GUIContent(current_area.export_terrain_path,current_area.export_terrain_path)); 
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			current_area.export_terrain_changed = EditorGUI.Toggle(Rect(guiWidth2+406,64+gui_y2,20,20),current_area.export_terrain_changed);
			if (GUI.changed) {
				if (!current_area.export_terrain_changed) {
					current_area.export_terrain_path = current_area.export_heightmap_path+"/Terrains";
				}	
			}
			GUI.changed = gui_changed_old;
			if (GUI.Button(Rect(guiWidth2+428,64+gui_y2,70,18),"Change")) {
				path_old = current_area.export_heightmap_path;
				if (!key.shift)
				{
					current_area.export_terrain_path = EditorUtility.OpenFolderPanel("Terrain Asset Path",current_area.export_terrain_path,"");
					if (current_area.export_terrain_path.Length == 0) {current_area.export_terrain_path = path_old;}
				}
				else
				{
					current_area.export_terrain_path = Application.dataPath;
				}
				if (path_old != current_area.export_heightmap_path) {
					if (current_area.export_terrain_path.IndexOf(Application.dataPath) == -1) {
						this.ShowNotification(GUIContent("The path should be inside your Unity project. Reselect your path."));
						current_area.export_terrain_path = Application.dataPath;
					}
					current_area.export_terrain_changed = true;
					if (!current_area.export_image_changed) {
						current_area.export_image_path = current_area.export_heightmap_path;
					}
					if (!current_area.export_terrain_changed) {
						current_area.export_terrain_path = current_area.export_heightmap_path+"/Terrains";
					}
				}
			}
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(Rect(guiWidth2+19,83+gui_y2,200,20),"Asset Name",EditorStyles.boldLabel);
			
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			current_area.terrain_asset_name = EditorGUI.TextField(Rect(guiWidth2+204,83+gui_y2,200,17),current_area.terrain_asset_name);
			if (GUI.changed) {
				current_area.terrain_name_changed = true;
			}	
			GUI.changed = false;
			current_area.terrain_name_changed = EditorGUI.Toggle(Rect(guiWidth2+406,83+gui_y2,20,20),current_area.terrain_name_changed);
			if (GUI.changed) {
				if (!current_area.terrain_name_changed) {
					current_area.terrain_asset_name = "_"+current_area.export_heightmap_filename;
					current_area.terrain_scene_name = current_area.export_heightmap_filename;
				}
			}
			GUI.changed = gui_changed_old;
			if (global_script.map.path_display) {
				if (GUI.Button(Rect(guiWidth2+471,85+gui_y2,25,15),"<",EditorStyles.miniButtonMid)) { 
					global_script.map.path_display = false;
				}
			}
			else if (GUI.Button(Rect(guiWidth2+471,85+gui_y2,25,15),">",EditorStyles.miniButtonMid)) {
				global_script.map.path_display = true;
			}
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(Rect(guiWidth2+19,102+gui_y2,200,20),"Scene Name",EditorStyles.boldLabel);
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			current_area.terrain_scene_name = EditorGUI.TextField(Rect(guiWidth2+204,102+gui_y2,200,17),current_area.terrain_scene_name);
			if (GUI.changed) {
				current_area.terrain_name_changed = true;
			}	
			GUI.changed = gui_changed_old;
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(Rect(guiWidth2+19,125+gui_y2,200,20),"Terrain Height",EditorStyles.boldLabel);
			GUI.color = Color.white;
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			current_area.terrain_height = EditorGUI.FloatField(Rect(guiWidth2+204,125+gui_y2,75,17),current_area.terrain_height);
			if (GUI.changed) {
				if (current_area.terrain_height < 1) {current_area.terrain_height = 1;}
			}
			GUI.changed = gui_changed_old;
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+282,125+gui_y2,80,20),"Scale",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.terrain_scale = EditorGUI.FloatField(Rect(guiWidth2+324,125+gui_y2,80,17),current_area.terrain_scale);
			if (current_area.terrain_scale <= 0) {current_area.terrain_scale = 1;}
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,145+gui_y2,200,20),"Generate Heightmap",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.do_heightmap = EditorGUI.Toggle(Rect(guiWidth2+204,145+gui_y2,200,20),current_area.do_heightmap);
			GUI.color = global_script.map.color;
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,165+gui_y2,200,20),"Heightmap Offset",EditorStyles.boldLabel);
			GUI.color = Color.white;
			EditorGUI.LabelField(Rect(guiWidth2+204,165+gui_y2,20,20),"X");
			current_area.heightmap_offset.x = EditorGUI.FloatField(Rect(guiWidth2+220,165+gui_y2,80,18),current_area.heightmap_offset.x);
			EditorGUI.LabelField(Rect(guiWidth2+304,165+gui_y2,20,20),"Y");
			current_area.heightmap_offset.y = EditorGUI.FloatField(Rect(guiWidth2+324,165+gui_y2,80,18),current_area.heightmap_offset.y);
			GUI.color = global_script.map.color;
			
			/*
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+14,163+gui_y2,200,20),"Import Heightmap",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.import_heightmap = EditorGUI.Toggle(Rect(guiWidth2+204,163+gui_y2,200,20),current_area.import_heightmap);
			GUI.color = global_script.map.color;
			
			if (current_area.import_heightmap) {
				EditorGUI.LabelField(Rect(guiWidth2+14,183+gui_y2,200,20),"Raw heightmap",EditorStyles.boldLabel);
				if (global_script.map.path_display) {
					GUI.color = global_script.map.backgroundColor; 
					EditorGUI.DrawPreviewTexture(Rect(guiWidth2+529,183+gui_y2,global_script.get_label_width(current_area.import_heightmap_path_full,true),20),global_script.tex2);
					GUI.color = Color.green;
					EditorGUI.LabelField(Rect(guiWidth2+528,183+gui_y2,global_script.get_label_width(current_area.import_heightmap_path_full,true),20),GUIContent(current_area.import_heightmap_path_full),EditorStyles.boldLabel);
				}
				EditorGUI.LabelField(Rect(guiWidth2+204,183+gui_y2,220,20),GUIContent(current_area.import_heightmap_path_full,current_area.import_heightmap_path_full)); 
				GUI.color = Color.white;
				
				if (GUI.Button(Rect(guiWidth2+428,183+gui_y2,70,18),"Open")) {
					path_old = current_area.import_heightmap_path_full;
					if (!key.shift)
					{
						current_area.import_heightmap_path_full = EditorUtility.OpenFilePanel("Open raw heightmap",current_area.import_heightmap_path_full,"raw");
						if (current_area.import_heightmap_path_full.Length == 0) {current_area.import_heightmap_path_full = path_old;}
					}
					else
					{
						current_area.import_heightmap_path_full = Application.dataPath;
					}
				}
				if (global_script.map.path_display) {
					if (GUI.Button(Rect(guiWidth2+471,207+gui_y2,25,15),"<",EditorStyles.miniButtonMid)) { 
						global_script.map.path_display = false;
					}
				}
				else if (GUI.Button(Rect(guiWidth2+471,207+gui_y2,25,15),">",EditorStyles.miniButtonMid)) {
					global_script.map.path_display = true;
				}
			}
			*/
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,186+gui_y2+import_height,200,20),"Heightmap Resolution",EditorStyles.boldLabel); 
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			current_area.terrain_heightmap_resolution_select = EditorGUI.Popup(Rect(guiWidth2+204,186+gui_y2+import_height,200,17),current_area.terrain_heightmap_resolution_select,heightmap_resolution_list); 
			if (GUI.changed) {
				current_area.terrain_heightmap_resolution = Mathf.Pow(2,current_area.terrain_heightmap_resolution_select+5)+1;
				current_area.terrain_heightmap_resolution_changed = true;
			}
			
			//if ((current_area.terrain_heightmap_resolution > (current_area.heightmap_resolution.x/current_area.tiles.x)+1) && current_area.terrain_heightmap_resolution > 33) {
			//	current_area.terrain_heightmap_resolution = (current_area.heightmap_resolution.x/current_area.tiles.x)+1;
				if (current_area.terrain_heightmap_resolution < 33) {current_area.terrain_heightmap_resolution = 33;}
			//	current_area.terrain_heightmap_resolution_select = (Mathf.Log(current_area.terrain_heightmap_resolution-1)/Mathf.Log(2))-5;
				
			//	this.ShowNotification(GUIContent("The resolution of your exported heightmap for each terrain tile is "+(current_area.heightmap_resolution.x/current_area.tiles.x).ToString()+". You can only select a lower resolution for faster performance."));
			//}
				
			GUI.changed = false;
			current_area.terrain_heightmap_resolution_changed = EditorGUI.Toggle(Rect(guiWidth2+407,186+gui_y2+import_height,20,20),current_area.terrain_heightmap_resolution_changed);
			// current_area.terrain_heightmap_resolution_changed = false;
			if (GUI.changed) {
				if (!current_area.terrain_heightmap_resolution_changed) {calc_terrain_heightmap_resolution();}
			}
			GUI.changed = gui_changed_old;
			GUI.color = global_script.map.color;
			// EditorGUI.LabelField(Rect(guiWidth2+204,186+gui_y2+import_height,200,20),current_area.heightmap_resolution.x.ToString()+"x"+current_area.heightmap_resolution.y.ToString()+" ("+(current_area.heightmap_resolution.x/current_area.tiles.x).ToString()+" per tile)");
			EditorGUI.LabelField(Rect(guiWidth2+424,186+gui_y2+import_height,200,20),"("+(current_area.heightmap_resolution.x/current_area.tiles.x).ToString()+")");
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,205+gui_y2+import_height,200,20),"Satellite Images",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.do_image = EditorGUI.Toggle(Rect(guiWidth2+204,205+gui_y2+import_height,200,20),current_area.do_image);
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,224+gui_y2+import_height,200,20),"Image Import Settings",EditorStyles.boldLabel);
			GUI.color = Color.white;
			if (!apply_import_settings) {
				if (GUI.Button(Rect(guiWidth2+204,224+gui_y2+import_height,70,18),"Apply")) {
					save_global_settings();
					
					start_image_import_settings(current_area);
				}
			}
			else {
				if (GUI.Button(Rect(guiWidth2+204,224+gui_y2+import_height,70,18),"Stop")) {
					apply_import_settings = false;
				}
				GUI.color = Color.red;
				EditorGUI.LabelField(Rect(guiWidth2+330,224+gui_y2+import_height,130,19),((create_area.tiles.x*create_area.tiles.y)-import_settings_count).ToString());
			}
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+278,224+gui_y2+import_height,130,19),"Auto");
			GUI.color = Color.white;
			current_area.auto_import_settings_apply = EditorGUI.Toggle(Rect(guiWidth2+310,224+gui_y2+import_height,25,19),current_area.auto_import_settings_apply);
			
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,243+gui_y2+import_height,200,20),"Generate Mip Maps",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.mipmapEnabled = EditorGUI.Toggle(Rect(guiWidth2+204,243+gui_y2+import_height,200,20),current_area.mipmapEnabled);
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(Rect(guiWidth2+19,262+gui_y2+import_height,200,20),"Filter Mode",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.filterMode = EditorGUI.EnumPopup(Rect(guiWidth2+204,262+gui_y2+import_height,200,20),current_area.filterMode);
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,281+gui_y2+import_height,200,20),"Aniso Level",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.anisoLevel = EditorGUI.Slider(Rect(guiWidth2+204,281+gui_y2+import_height,200,17),current_area.anisoLevel,0,9);
			GUI.color = global_script.map.color;
			EditorGUI.LabelField(Rect(guiWidth2+19,300+gui_y2+import_height,200,20),"Max size",EditorStyles.boldLabel);
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			GUI.color = Color.white;
			current_area.maxTextureSize_select = EditorGUI.Popup(Rect(guiWidth2+204,300+gui_y2+import_height,200,20),current_area.maxTextureSize_select,image_resolution_list);
			if (GUI.changed) {
				current_area.maxTextureSize = Mathf.Pow(2,current_area.maxTextureSize_select+5);
				current_area.maxTextureSize_changed = true;	
			}
			GUI.changed = false;
			current_area.maxTextureSize_changed = EditorGUI.Toggle(Rect(guiWidth2+406,300+gui_y2+import_height,20,20),current_area.maxTextureSize_changed);
			if (GUI.changed) {
				if (!current_area.maxTextureSize_changed) {
					if (current_area.resolution > 4096) {current_area.maxTextureSize = 4096;current_area.maxTextureSize_select = 7;}
						else {current_area.maxTextureSize = current_area.resolution;current_area.maxTextureSize_select = Mathf.Log(current_area.maxTextureSize,2)-5;}
				}
			}
			GUI.changed = gui_changed_old;
			GUI.color = global_script.map.color;
			
			EditorGUI.LabelField(Rect(guiWidth2+19,324+gui_y2+import_height,200,20),"Format",EditorStyles.boldLabel);
			GUI.color = Color.white;
			current_area.textureFormat = EditorGUI.EnumPopup(Rect(guiWidth2+204,324+gui_y2+import_height,200,20),current_area.textureFormat);
			GUI.color = global_script.map.color;
			
			if (terraincomposer) {
				EditorGUI.LabelField(Rect(guiWidth2+19,343+gui_y2+import_height,200,20),"Export to TerrainComposer",EditorStyles.boldLabel);
				GUI.color = Color.white;
				current_area.export_to_terraincomposer = EditorGUI.Toggle(Rect(guiWidth2+204,343+gui_y2+import_height,20,20),current_area.export_to_terraincomposer);
				GUI.color = global_script.map.color;
				
				if (current_area.export_to_terraincomposer) {
					EditorGUI.LabelField(Rect(guiWidth2+19,362+gui_y2+import_height,200,20),"Add Perlin to heightmap",EditorStyles.boldLabel);
					GUI.color = Color.white;
					current_area.filter_perlin = EditorGUI.Toggle(Rect(guiWidth2+204,362+gui_y2+import_height,20,20),current_area.filter_perlin);
					GUI.color = global_script.map.color;
				}
			}
			if (!current_area.export_to_terraincomposer || !terraincomposer) {
				EditorGUI.LabelField(Rect(guiWidth2+19,300+gui_y2+import_height+tc_height,200,20),"Heightmap Curve",EditorStyles.boldLabel);
				GUI.color = Color.white;
				current_area.terrain_curve = EditorGUI.CurveField(Rect(guiWidth2+205,301+gui_y2+import_height+tc_height,198,17),current_area.terrain_curve);
				if (GUI.Button(Rect(guiWidth2+406,301+gui_y2+import_height+tc_height,20,17),"R")) {
					current_area.terrain_curve = new AnimationCurve.Linear(0,0,1,1);
					current_area.terrain_curve.AddKey(1,0);
					current_area.terrain_curve = current_area.set_curve_linear(current_area.terrain_curve);
				}
				GUI.color = global_script.map.color; 
			}
			 
			GUI.color = Color.white;
			if (!create_terrain_loop) {
				if (GUI.Button(Rect(guiWidth2+19,319+gui_y2+import_height+tc_height,130,37),"Create Terrain")) {
					if (global_script.map.export_raw && !global_script.map.export_jpg && !global_script.map.export_png) {
						this.ShowNotification (GUIContent("It is only possible to create terrains with Jpg (Recommended) or Png images. The raw is for photoshop editing"));
						return;
					}
					save_global_settings();
					create_terrains_area();
				}
				if ((!current_area.export_to_terraincomposer || !terraincomposer) && current_area.terrain_done) {
	    			if (!generate) {
		    			if (GUI.Button(Rect(guiWidth2+204,319+gui_y2+import_height+tc_height,130,20),"Generate Heightmap")) {
							heightmap_count_terrain = 0;
							generate_manual = true;
							create_region = current_region;
							create_area = current_area;
							generate_begin();
							heightmap_y = heightmap_resolution-1;
		    				generate = true;
		    			}
		    			if (GUI.Button(Rect(guiWidth2+339,319+gui_y2+import_height+tc_height,65,20),"Smooth")) {
							smooth_all_terrain(current_area.smooth_strength);
		    			}
		    			current_area.smooth_strength = EditorGUI.FloatField(Rect(guiWidth2+409,321+gui_y2+import_height+tc_height,63,17),current_area.smooth_strength);
		    		}
		    		else {
		    			if (GUI.Button(Rect(guiWidth2+203,319+gui_y2+import_height+tc_height,130,20),"Stop")) {
							generate = false;
							generate_manual = false;
							if (raw_file.fs) {raw_file.fs.Close();} 
						}
						GUI.color = Color.red;
		    			EditorGUI.LabelField(Rect(guiWidth2+337,319+gui_y2+import_height+tc_height,130,20),((create_area.tiles.x*create_area.tiles.y)-heightmap_count_terrain).ToString(),EditorStyles.boldLabel);
		    		}
				}
			} else { 
				if (GUI.Button(Rect(guiWidth2+18,319+gui_y2+import_height+tc_height,130,36),"Stop")) {
					create_terrain_loop = false;
					if (!global_script.map.export_heightmap_active && !global_script.map.export_image_active) {Application.runInBackground = false;}
					// clear_terrains();
					generate = false;
					if (raw_file.fs) {raw_file.fs.Close();}
				}
			}
			if (create_terrain_loop) {
				GUI.color = Color.red;
				EditorGUI.LabelField(Rect(guiWidth2+150,319+gui_y2+import_height+tc_height,130,36),((create_area.tiles.x*create_area.tiles.y)-create_terrain_count).ToString());
			}
			GUI.color = global_script.map.color;
		}
		
		screen_rect = Rect(0,0,guiWidth2,gui_y);
		
		if (!global_script.map_load && global_script.settings.myExt)
		{
			// GUI.color = Color.white;
			// EditorGUI.ProgressBar(Rect(5,100,200,20),global_script.settings.myExt.progress,String.Empty);
		}
		if (!global_script.map_load2 && global_script.settings.myExt2)
		{
			// GUI.color = Color.white;
			// EditorGUI.ProgressBar(Rect(5,100,200,20),(global_script.settings.myExt2.progress/2.0)+0.5,String.Empty);
		}
		// GUI.color = Color.white;
		
		// if (scroll && global_script.preview_window_mode > 0)
		// {
			mouse_move = key.delta;
			// if (check_point_in_rect(current_layer.rect,mouse_position - Vector2(-5,script.settings.top_height)) && key.button == 0 && key.clickCount == 2 && key.type == EventType.layout)
			
			if (key.button == 0 && key.clickCount == 2)
			{
				if (key.mousePosition.y > 20 && !current_area.resize)
				{	
					if (!check_in_rect())
					{
						stop_download();
						latlong_animate = latlong_mouse;
						animate_time_start = Time.realtimeSinceStartup;
						animate = true;
					}
				}
			}
			
			if (key.button == 0)
			{
				if (key.type == EventType.MouseDown) {
					if (!check_in_rect()) {map_scrolling = true;}
				} 
				else if (key.type == EventType.MouseUp) {
					map_scrolling = false;
				}
				
				if (key.type == EventType.MouseDrag) {
					if ((!check_in_rect() || map_scrolling) && map_scrolling && key.mousePosition.y > 0 && !current_area.resize) {
						animate = false;
						move_center(Vector2(-mouse_move.x/global_script.map.mouse_sensivity,mouse_move.y/global_script.map.mouse_sensivity),true);
					}
				}
			}
			
			if (key.type == EventType.ScrollWheel)
			{
				var zoom_change: boolean = false;
				
				if (key.delta.y > 0)
				{
					if (global_script.map_zoom > 1) 
					{
						if (zoom1 > 0){zoom1 = (zoom1-1)/2;if (zoom1 < 1){zoom1 = 0;}}
						else if (zoom1 < 0){zoom1_step /= 2;zoom1 += zoom1_step;} else {zoom1 = -0.5;zoom1_step = -0.5;}
						
						if (zoom2 > 0){zoom2 = (zoom2-1)/2;if (zoom2 < 1){zoom2 = 0;}}
						else if (zoom2 < 0){zoom2_step /= 2;zoom2 += zoom2_step;} else {zoom2 = -0.5;zoom2_step = -0.5;}
						
						if (zoom3 > 0){zoom3 = (zoom3-1)/2;if (zoom3 < 1){zoom3 = 0;}}
						else if (zoom3 < 0){zoom3_step /= 2;zoom3 += zoom3_step;} else {zoom3 = -0.5;zoom3_step = -0.5;}
						
						if (zoom4 > 0){zoom4 = (zoom4-1)/2;if (zoom4 < 1){zoom4 = 0;}}
						else if (zoom4 < 0){zoom4_step /= 2;zoom4 += zoom4_step;} else {zoom4 = -0.5;zoom4_step = -0.5;}
						
						// global_script.map_long = tc_global_script.pixel_to_latlong(Vector2(-384,0),Vector2(global_script.map_long,global_script.map_lat),global_script.map_zoom,768).x;
						// offset2 = Vector2(16,16); 
						convert_center();
						--global_script.map_zoom;
						zoom_change = true;
						request_map_timer();
					}
				} 
				else 
				{
					if (global_script.map_zoom < 19)  
					{	
						if (zoom1 < 0){zoom1 -= zoom1_step;zoom1_step *= 2;if (zoom1 > -0.5){zoom1 = 0;}}   
						else if (zoom1 > 0)
						{
							zoom1 = (zoom1*2)+1;
						} else {zoom1 = 1;}
						
						if (zoom2 < 0){zoom2 -= zoom2_step;zoom2_step *= 2;if (zoom2 > -0.5){zoom2 = 0;}}   
						else if (zoom2 > 0)
						{
							zoom2 = (zoom2*2)+1;
						} else {zoom2 = 1;}
						
						if (zoom3 < 0){zoom3 -= zoom3_step;zoom3_step *= 2;if (zoom3 > -0.5){zoom3 = 0;}}   
						else if (zoom3 > 0)
						{
							zoom3 = (zoom3*2)+1;
						} else {zoom3 = 1;}
						
						if (zoom4 < 0){zoom4 -= zoom4_step;zoom4_step *= 2;if (zoom4 > -0.5){zoom4 = 0;}}   
						else if (zoom4 > 0)
						{
							zoom4 = (zoom4*2)+1;
						} else {zoom4 = 1;}
						
						convert_center();
						++global_script.map_zoom;
						
						zoom_change = true;
						request_map_timer();
					}
				} 
				
				if (zoom_change)
				{
					stop_download();
					button0 = true;
					time1 = Time.realtimeSinceStartup;
					zooming = true;
				}
			}
		
		if (global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 1) {
			
			var blink: float;
			if (!global_script.map.preimage_edit.loop) {
				blink = 1-((global_script.map.preimage_edit.y1*1.0)/768.0);
			}
			else {
				if (convert_texture) {blink = 1-((global_script.map.preimage_edit.y1*1.0)/convert_texture.height);}
			}
			
			GUI.color = Color(blink,1-blink,0,2);
			if (global_script.map.preimage_edit.loop) {
				old_fontSize = GUI.skin.label.fontSize;
				old_fontStyle = GUI.skin.label.fontStyle;
				
				GUI.skin.label.fontSize = 17;
				GUI.skin.label.fontStyle = FontStyle.Bold;
				
				if (global_script.map.preimage_edit.loop_active) {
					GUI.Label(Rect((position.width/2)-65,(position.height/2)+10,200,25),"Generating "+((convert_area.tiles.x*convert_area.tiles.y)-convert_area.preimage_count)+"...");
				}
				else {
					GUI.Label(Rect((position.width/2)-52,(position.height/2)+10,200,25),"Pause "+((convert_area.tiles.x*convert_area.tiles.y)-convert_area.preimage_count)+"...");
				}
				
				GUI.skin.label.fontSize = old_fontSize;
				GUI.skin.label.fontStyle = old_fontStyle;
			}
			else {
				old_fontSize = GUI.skin.label.fontSize;
				old_fontStyle = GUI.skin.label.fontStyle;
				
				GUI.skin.label.fontSize = 17;
				GUI.skin.label.fontStyle = FontStyle.Bold;
				 
				GUI.Label(Rect((position.width/2)+350,(position.height/2)-10,200,25),"Generating..."); 
				
				GUI.skin.label.fontSize = old_fontSize;
				GUI.skin.label.fontStyle = old_fontStyle;
			}
		}
		
		if (notify_text.Length != 0) {
			if (notify_frame > 1) {
				this.ShowNotification(GUIContent(notify_text));
				notify_text = String.Empty;
				notify_frame = 0;
			}
			++notify_frame;
		}
		
		if (global_script.map.export_heightmap_active || global_script.map.export_image_active) {
			this.Repaint();
		}
	}
	
	function move_to_latlong(latlong: latlong_class,speed: float): boolean
	{
		var latlong_center: latlong_class = global_script.pixel_to_latlong(Vector2(0,0),global_script.map_latlong_center,zoom);
		
		var pixel: Vector2 = global_script.latlong_to_pixel(latlong,latlong_center,zoom,Vector2(position.width,position.height));
		
		var delta_x: float = (pixel.x-(position.width/2))-offset_map.x;
		var delta_y: float = -((pixel.y-(position.height/2))+offset_map.y);
		
		if (Mathf.Abs(delta_x) < 0.01 && Mathf.Abs(delta_y) < 0.01)
		{
			global_script.map_latlong_center = latlong;
			offset_map = Vector2(0,0);
			// offset2 = Vector2(0,0);
			// convert_center();
			
			request_map();
			this.Repaint();
			return true;
		}
		
		delta_x /= (250/speed);
		delta_y /= (250/speed); 
		
		move_center(Vector2(delta_x,delta_y),false);
		
		return false;
	}
	
	function move_center(offset2: Vector2,map: boolean)
	{
		offset = offset2;
		
		offset_map += offset;
						
		// if (zoom_pos != 0){offset_map += offset/(zoom_pos1+1);} else {offset_map += offset;}				
		if (zoom_pos1 != 0){offset_map1 += offset/(zoom_pos1+1);} else {offset_map1 += offset;}///zoom_pos1;
		if (zoom_pos2 != 0){offset_map2 += offset/(zoom_pos2+1);} else {offset_map2 += offset;}///zoom_pos2;}
		if (zoom_pos3 != 0){offset_map3 += offset/(zoom_pos3+1);} else {offset_map3 += offset;}
		if (zoom_pos4 != 0){offset_map4 += offset/(zoom_pos4+1);} else {offset_map4 += offset;}
		  
		// offset_map1 += offset*Mathf.Pow(2,(global_script.map_zoom_old-zoom));
		// offset_map2 += offset*Mathf.Pow(2,(global_script.map_zoom_old-zoom));
		// offset_map3 += offset*Mathf.Pow(2,(global_script.map_zoom_old-zoom));
		// offset_map4 += offset*Mathf.Pow(2,(global_script.map_zoom_old-zoom));
		// if (zoom_pos2 != 0){offset_map2 += offset/(zoom_pos2+1);} else {offset_map2 += offset;}///zoom_pos2;}
		// if (zoom_pos3 != 0){offset_map3 += offset/(zoom_pos3+1);} else {offset_map3 += offset;}
		// if (zoom_pos4 != 0){offset_map4 += offset/(zoom_pos4+1);} else {offset_map4 += offset;}
		
		if (map) {stop_download();request_map_timer();}
		
		// Debug.Log("zoom: "+zoom+" zoom_old: "+Mathf.Pow(2,(global_script.map_zoom_old-zoom)));				
														
		this.Repaint();
	}
	
	function convert_center()
	{
		// return;
		global_script.map_latlong_center = global_script.pixel_to_latlong(Vector2(offset_map.x,-offset_map.y),global_script.map_latlong_center,zoom);
		
		offset_map = Vector2(0,0);
		// offset = Vector2(0,0);
		// offset2 = Vector2(0,0);
	}
	
	function request_map_timer()
	{
		time1 = Time.realtimeSinceStartup;
		
		request1 = true;
		request2 = true;
				
		if (!global_script.map.button_image_editor) {
			request3 = true;
			request4 = true;
		}
		
		this.Repaint();
	}
	
	
	function request_map()
	{
		if (!global_script) {return;}
		
		request_map1();
		request_map2();
						
		if (!global_script.map.button_image_editor) {
			request_map3();
			request_map4();
		}
		
		this.Repaint();
	}
	
	function reset_texture(texture: Texture) 
	{
		for (var y: int = 0;y < texture.height;++y) {
			for (var x: int = 0;x < texture.width;++x) {
				texture.SetPixel(x,y,Color(0,0,0,0));
			}
		}
		
		texture.Apply();
	}
	
	function request_map1()
	{
		if (!global_script.map.active){return;}
		stop_download_map1();
		
		request_load1 = true;
		global_script.map_load = false;
		 
		global_script.map_latlong = global_script.pixel_to_latlong(Vector2(-400,0),global_script.map_latlong_center,global_script.map_zoom);
			
		var url: String = "http://dev.virtualearth.net/REST/v1/Imagery/Map/"+global_script.map.type.ToString()+"/"+global_script.map_latlong.latitude+","+global_script.map_latlong.longitude+"/"+global_script.map_zoom+"?&mapSize=800,800&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key;
		// Debug.Log(url);
		global_script.settings.myExt = new WWW(url); 
		
		++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
	}
	
	function request_map2()
	{
		if (!global_script.map.active){return;}
		stop_download_map2();
		
		request_load2 = true;
		global_script.map_load = false;
		
		global_script.map_latlong.longitude = global_script.pixel_to_latlong(Vector2(400,0),global_script.map_latlong_center,global_script.map_zoom).longitude;//0.00859;
				
		var url1: String = "http://dev.virtualearth.net/REST/v1/Imagery/Map/"+global_script.map.type.ToString()+"/"+global_script.map_latlong.latitude+","+global_script.map_latlong.longitude+"/"+global_script.map_zoom+"?&mapSize=800,800&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key;
		global_script.settings.myExt2 = new WWW(url1); 
		++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;	
	}
	
	function request_map3()
	{
		if (!global_script.map.active){return;}
		if (global_script.map_zoom > 2)
		{ 
			stop_download_map3();
		
			request_load3 = true;
			global_script.map_load3 = false;
			// var new_latlong: latlong_class = script.pixel_to_latlong(Vector2(-16,-16),script.map_latlong_center,script.map_zoom);
			var url2: String = "http://dev.virtualearth.net/REST/v1/Imagery/Map/"+global_script.map.type.ToString()+"/"+global_script.map_latlong_center.latitude+","+global_script.map_latlong_center.longitude+"/"+(global_script.map_zoom-2)+"?&mapSize=800,800&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key;
			global_script.settings.myExt3 = new WWW(url2); 
			++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
		}
	}
	
	function request_map4()
	{
		if (!global_script.map.active){return;}
		if (global_script.map_zoom > 3)
		{
			stop_download_map4();
			request_load4 = true;
			global_script.map_load4 = false;
			// var new_latlong2: latlong_class = global_script.pixel_to_latlong(Vector2(110,110),global_script.map_latlong_center,global_script.map_zoom);
			var url3: String = "http://dev.virtualearth.net/REST/v1/Imagery/Map/"+global_script.map.type.ToString()+"/"+global_script.map_latlong_center.latitude+","+global_script.map_latlong_center.longitude+"/"+(global_script.map_zoom-3)+"?&mapSize=800,800&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key;
			global_script.settings.myExt4 = new WWW(url3); 
			++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
		} 
	}
	
	function set_preview()
	{
		if (!global_script){return;}
		
		var mode: int = global_script.preview_window_mode;
		
		if (mode == 10)
		{
			stop_download();
			// if (!script.map_load){return;}
			// script.map_zoom_old = script.map_zoom;
			
			
			// var url: String = "http://maps.google.com/maps/api/staticmap?center="+script.map_lat.ToString()+","+script.map_long.ToString()+"&zoom="+script.map_zoom.ToString()+"&size=512x512&maptype=satellite&sensor=true";
			// var url: String = "http://maps.google.com/maps?z=12&t=m&q=loc:"+script.map_lat.ToString()+"+-78.3020"
			// var url: String = "http://maps.google.com/maps?q="+script.map_lat.ToString()+","+script.map_long.ToString()+"13.091751"+"&z=17&t=k";
			// var url: String = "http://maps.google.de/maps?q=51.404989,13.091751&z=17&t=k";
			
			//var url: String = "http://maps.google.com/maps?z=12&t=m&q=loc:38.9419+-78.3020";
			// var url: String = "http://www.openstreetmap.org/?minlon=22.3418234&minlat=57.5129102&maxlon=22.5739625&maxlat=57.6287332&box=yes";

			return;
		}
	}
	
	function stop_download()
	{
		stop_download_map1();
		stop_download_map2();
		stop_download_map3();
		stop_download_map4();
	}
	
	function stop_download_map1()
	{
		if (request_load1)
		{
			global_script.map_load = false;
			if (global_script.settings.myExt){global_script.settings.myExt.Dispose();global_script.settings.myExt = null;}
		}
		request_load1 = false;
	}
	
	function stop_download_map2()
	{
		if (request_load2)
		{
			global_script.map_load2 = false;
			if (global_script.settings.myExt2){global_script.settings.myExt2.Dispose();global_script.settings.myExt2 = null;}
		}
		request_load2 = false;
	}
	
	function stop_download_map3()
	{
		if (request_load3)
		{
			global_script.map_load3 = false;
			if (global_script.settings.myExt3){global_script.settings.myExt3.Dispose();global_script.settings.myExt3 = null;}
		}
		request_load3 = false;
	}
	
	function stop_download_map4()
	{
		if (request_load4)
		{
			global_script.map_load4 = false;
			if (global_script.settings.myExt4){global_script.settings.myExt4.Dispose();global_script.settings.myExt4 = null;}
		}
		request_load4 = false;
	}
	
	
	function get_elevation_info(latlong: latlong_class)
	{
		// global_script.map.elExt_check = new WWW("http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=46.62303,10.71257,46.65326,10.75652&rows=32&cols=32&heights=ellipsoid&key=");
		global_script.map.elExt_check = new WWW("http://dev.virtualearth.net/REST/v1/Elevation/List?points="+latlong.latitude.ToString()+","+latlong.longitude.ToString()+"&heights=ellipsoid&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key);
		++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
		global_script.map.elExt_check_loaded = false;
	}
	
	function drawGUIBox(rect: Rect,text: String,backgroundColor: Color,highlightColor: Color,textColor: Color)
	{
		// GUI.color = Color(1,1,1,global_script.map.alpha);
		
		GUI.color = Color(1,1,1,backgroundColor.a);
		EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y+19,rect.width,rect.height-19),global_script.tex2);
		// GUI.color = highlightColor;
		GUI.color = Color(1,1,1,highlightColor.a);
		EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,19),global_script.tex3);
		
		GUI.color = textColor;
		EditorGUI.LabelField(Rect(rect.x,rect.y+1,rect.width,19),text,EditorStyles.boldLabel);
		
		gui_y += rect.height+2;
		gui_height = 0;
	}
	
	function Update()
	{
		if (!global_script) {return;}
		
		check_content_done();
		
		if (Time.realtimeSinceStartup > save_global_time+(global_script.settings.save_global_timer*60)) {
        	save_global_settings();
        	save_global_time = Time.realtimeSinceStartup;
        }
		
		if (global_script.map.preimage_edit.generate) {
			if (global_script.map.preimage_edit.mode == 2) {
				convert_textures_raw(convert_area);
			}
			else {
				image_edit_apply();
			}
		} 
		
		if (combine_generate) {
			combine_textures();
			this.Repaint();
		}
		
		if (slice_generate)
		{
			slice_textures();
			this.Repaint();
		}
		
		if (import_settings_call) {
			
			import_settings_call = false;
			
			if (import_jpg_call) {
				import_jpg_call = false;
				// Debug.Log("!!"+import_jpg_path);
				// Debug.Log(import_image_area.textureFormat+","+import_image_area.resolution);
				global_script.set_image_import_settings(import_jpg_path,false,import_image_area.textureFormat,TextureWrapMode.Clamp,import_image_area.resolution,import_image_area.mipmapEnabled,import_image_area.filterMode,import_image_area.anisoLevel,127);						
			}
			
			if (import_png_call) {
				import_png_call = false;
				global_script.set_image_import_settings(import_png_path,false,import_image_area.textureFormat,TextureWrapMode.Clamp,import_image_area.resolution,import_image_area.mipmapEnabled,import_image_area.filterMode,import_image_area.anisoLevel,127);						
			}
		}
		
		if (zooming) 
		{ 
			zoom_pos = Mathf.Lerp(zoom_pos,zoom1,0.1);
			
			zoom_pos1 = Mathf.Lerp(zoom_pos1,zoom1,0.1);
			zoom_pos2 = Mathf.Lerp(zoom_pos2,zoom2,0.1);
			
			zoom_pos3 = Mathf.Lerp(zoom_pos3,zoom3,0.1);
			zoom_pos4 = Mathf.Lerp(zoom_pos4,zoom4,0.1);
			
			if (Mathf.Abs(zoom_pos1-zoom1) < 0.001) {
				zoom_pos = zoom1;
				zoom_pos1 = zoom1;
				zoom_pos2 = zoom2;
				zoom_pos3 = zoom3;
				zoom_pos4 = zoom4;
				zooming = false;
			}
			this.Repaint(); 
		}
		
		if (animate)
		{
			if (move_to_latlong(latlong_animate,45))
			{
				// Debug.Log("animate complete");
				animate = false;
			}
		}
				
		if (create_terrain_loop) {
			if (!generate) {
				create_terrain(terrain_region.area[0],terrain_region.area[0].terrains[0],Application.dataPath+"/Terrains",terrain_parent.transform);
				this.Repaint();
			}
		}
		if (apply_import_settings) {
			var path: String;
			var tile: tile_class;
		
			tile = calc_terrain_tile(import_settings_count,terrain_region.area[0].tiles_select);	
			if (!tile) {return;}
			
			if (global_script.map.export_jpg) {
				path = create_area.export_image_path.Replace(Application.dataPath,"Assets")+"/"+create_area.export_image_filename+"_x"+tile.x.ToString()+"_y"+tile.y.ToString()+".jpg";
				if (!File.Exists(path)) {
					this.ShowNotification (GUIContent(path+" doesn't exist! Make sure the image tiles are the same as the exported image tiles"));
					Debug.Log(path+" doesn't exist! Make sure the image tiles are the same as the exported image tiles.");
				}
				else {
					global_script.set_image_import_settings(path,false,create_area.textureFormat,TextureWrapMode.Clamp,create_area.maxTextureSize,create_area.mipmapEnabled,create_area.filterMode,create_area.anisoLevel,124);	
				}
			}
			
			if (global_script.map.export_png) {
				path = create_area.export_image_path.Replace(Application.dataPath,"Assets")+"/"+create_area.export_image_filename+"_x"+tile.x.ToString()+"_y"+tile.y.ToString()+".png";
				if (!File.Exists(path)) {
					this.ShowNotification (GUIContent(path+" doesn't exist! Make sure the image tiles are the same as the exported image tiles"));
					Debug.Log(path+" doesn't exist! Make sure the image tiles are the same as the exported image tiles.");
				}
				else {
					global_script.set_image_import_settings(path,false,create_area.textureFormat,TextureWrapMode.Clamp,create_area.maxTextureSize,create_area.mipmapEnabled,create_area.filterMode,create_area.anisoLevel,124);	
				}
			}
			
			++import_settings_count;
			if (import_settings_count > (create_area.tiles.x*create_area.tiles.y)-1) {
				apply_import_settings = false;
			}
			
			this.Repaint();
		}
		
		if (generate) {
			generate_heightmap2();
		}
		
		if (request1 && Time.realtimeSinceStartup-time1 > 1.5)
		{
			// Debug.Log("Request1....");
			request1 = false;
			convert_center();
			request_map1();
		}
		if (request2 && Time.realtimeSinceStartup-time1 > 1.7)
		{
			// Debug.Log("Request2....");
			request2 = false;
			convert_center();
			request_map2();
		}
		
		if (request3 && Time.realtimeSinceStartup-time1 > 1.9)
		{
			// Debug.Log("Request3....");
			request3 = false;
			convert_center();
			request_map3();
		}
		if (request4 && Time.realtimeSinceStartup-time1 > 2.1)
		{
			// Debug.Log("Request4....");
			request4 = false;
			convert_center();
			request_map4();
		}
		// if (!script.map_load || !script.map_load2){this.Repaint();}
	
	if (global_script.map.elExt_check)
	{
		if (global_script.map.elExt_check.isDone && !global_script.map.elExt_check_loaded)
		{
			if (global_script.map.elExt_check.error == null)
			{
				var elData: String = global_script.map.elExt_check.text;
				var elData2: String = elData;
				var index_el1: int = elData.IndexOf("zoomLevel");
				var height: int;
				var zoom: int;
				
				// get zoom
				elData = elData.Substring(index_el1+11);
				index_el1 = elData.IndexOf("}");
				elData = elData.Substring(0,index_el1);
				zoom = Int16.Parse(elData);
				
				// get height
				index_el1= elData2.IndexOf("elevations");
				elData2 = elData2.Substring(index_el1+13);
				index_el1 = elData2.IndexOf("]");
				elData2 = elData2.Substring(0,index_el1);
				height = Int16.Parse(elData2);
				
				if (global_script.map.elExt_check_assign)
				{
					if (requested_area)
					{
						requested_area.center_height = height;
						requested_area.elevation_zoom = zoom;
						if (requested_area.heightmap_zoom == 0){requested_area.heightmap_zoom = requested_area.elevation_zoom;}
						
						calc_heightmap_settings(requested_area);
					}
					global_script.map.elExt_check_assign = false;
				}
				else
				{
					ShowNotification(GUIContent("Zoom Level: "+zoom+"-> "+Mathf.Round(global_script.calc_latlong_area_resolution(latlong_mouse,zoom))+" (m/p), Height: "+height+" (m)"));
					this.Repaint();
				}
			}
			else
			{
				ShowNotification(GUIContent("Can't download information"));
				this.Repaint();
			}
			global_script.map.elExt_check_loaded = true;
		}
	}
	
	if (global_script.settings.myExt) 
    {
    	if (global_script.settings.myExt.isDone && !global_script.map_load)
		{
			// Debug.Log("DONE!!!!");
			// global_script.map = global_script.settings.myExt.texture;
			
			// Debug.Log(global_script.settings.myExt.text);
			// global_script.settings.myExt.LoadImageIntoTexture(global_script.map);
			
			// global_script.map = global_script.settings.myExt.texture;
			// create_preview_window(global_script.map,"map",10);
			
			// export_texture_to_file(Application.dataPath,"map",global_script.map);
			global_script.map_load = true;
			// if (global_script.generate_auto){generate_auto();} 
			// generate_preview(1);
			if (!global_script.map1)
			{
				global_script.map1 = new Texture2D(800,800);
				global_script.map1.wrapMode = TextureWrapMode.Clamp;
			}
			// if (!global_script.map0){global_script.map0 = new Texture2D(1536,768);}
			
			var tt1: float = Time.realtimeSinceStartup;
			global_script.settings.myExt.LoadImageIntoTexture(global_script.map1);
			//pixels = global_script.map.GetPixels(0,32,768,768);
			
			//global_script.map.Resize(768,768);
			//global_script.map.SetPixels(0,0,768,768,pixels);
			//global_script.map.Apply();
			// Debug.Log("Time Texture Apply: "+(Time.realtimeSinceStartup-tt1));
			
			// global_script.map0.Apply();
			
			
			if (!global_script.map_load2){global_script.map_combine = false;}
			
			if (!global_script.map0){global_script.map0 = new Texture2D(1600,768);}
			
			pixels = global_script.map1.GetPixels(0,32,800,768);
			global_script.map0.SetPixels(0,0,800,768,pixels);
			
			// global_script.map_long_center = pixel_to_latlong(Vector2(384,0),Vector2(global_script.map_long,global_script.map_lat),global_script.map_zoom,768).x;
			// global_script.map_lat_center = global_script.map_lat;
		 	// global_script.map_lat = pixel_to_latlong(Vector2(0,0),Vector2(global_script.map_long,global_script.map_lat),global_script.map_zoom,768).y;
		}
		
	}
			
	if (global_script.settings.myExt2)
	{	
		if (global_script.settings.myExt2.isDone && !global_script.map_load2)
		{
			// Debug.Log("DONE2!!!!");
			// global_script.map = global_script.settings.myExt.texture;
			
			// Debug.Log(global_script.settings.myExt.text);
			if (!global_script.map2)
			{
				global_script.map2 = new Texture2D(800,800);
				global_script.map2.wrapMode = TextureWrapMode.Clamp;
			}
			
			//pixels = global_script.map2.GetPixels(0,32,768,768);
			//global_script.map2.Resize(768,768);
			//global_script.map2.SetPixels(0,0,768,768,pixels);
			
			// global_script.map2.Apply();
			
			// global_script.map = global_script.settings.myExt.texture;
			offset_map2 = Vector2(0,0);
			zoom2 = 0;
			// global_script.map_zoom_old = global_script.map_zoom;
			zoom_pos2 = 0;
			
			if (!global_script.map_load){global_script.map_combine = false;}
			
			this.Repaint();
			
			// export_texture_to_file(Application.dataPath,"map",global_script.map);
			global_script.map_load2 = true;
			/*			
			script.prelayers[0].layer[1].tree_output.scale = (2.34/Mathf.Pow(2,18))*Mathf.Pow(2,global_script.map_zoom);
			script.prelayers[0].layer[1].strength = (0.04*Mathf.Pow(2,18))/Mathf.Pow(2,global_script.map_zoom);
			
			script.prelayers[0].layer[2].strength = (0.224/Mathf.Pow(2,18))*Mathf.Pow(2,global_script.map_zoom);
			script.prelayers[0].layer[3].object_output.scale = (2.88/Mathf.Pow(2,18))*Mathf.Pow(2,global_script.map_zoom);
			
			script.filter[0].preimage.image[0] = global_script.map;
			script.subfilter[4].preimage.image[0] = global_script.map;
			script.filter[0].preimage.image[1] = global_script.map2;
			script.subfilter[4].preimage.image[1] = global_script.map2;
			script.subfilter[5].preimage.image[0] = global_script.map;
			script.subfilter[5].preimage.image[1] = global_script.map2;
			script.subfilter[10].preimage.image[0] = global_script.map;
			script.subfilter[10].preimage.image[1] = global_script.map2;
			*/
			// if (script.generate_auto){generate_auto();}
			// generate_preview(1);
			global_script.settings.myExt2.LoadImageIntoTexture(global_script.map2);
							
			if (!global_script.map0){global_script.map0 = new Texture2D(1600,768);}
			
			if (!global_script.map.button_image_editor) {
				pixels = global_script.map2.GetPixels(0,32,800,768);
				global_script.map0.SetPixels(800,0,800,768,pixels);
			}
		}
	}
	
	if (global_script.map_load && !global_script.map_combine && ((global_script.map_load2) || global_script.map.button_image_editor))
	{
		global_script.map0.Apply();
		global_script.map_combine = true;
		
		if (global_script.map.button_image_editor) {
			image_generate_begin();
		}
		
		global_script.map_zoom_old = global_script.map_zoom;
		
		offset_map1 = Vector2(0,0);
		zoom1 = 0;
		zoom_pos1 = 0; 
		
		this.Repaint();
		// Debug.Log("Time Texture Apply: "+(Time.realtimeSinceStartup-tt1)+" frame: "+(1/(Time.realtimeSinceStartup-tt1)));
	}
	
	if (global_script.settings.myExt3)
	{	
		if (global_script.settings.myExt3.isDone && !global_script.map_load3)
		{
			// Debug.Log("DONE3!!!!");
			
			if (!global_script.map3)
			{
				global_script.map3 = new Texture2D(800,768);
				global_script.map3.wrapMode = TextureWrapMode.Clamp;
			}
			global_script.settings.myExt3.LoadImageIntoTexture(global_script.map3);
			global_script.map_load3 = true;
			
			if (global_script.map3.width == 800 && global_script.map3.height == 800) {
				pixels = global_script.map3.GetPixels(0,32,800,768);
			
				global_script.map3.Resize(800,768);
				global_script.map3.SetPixels(0,0,800,768,pixels);
				global_script.map3.Apply();
			}
			
			zoom3 = 0;
			zoom_pos3 = 0;
			offset_map3 = Vector2(0,0); 
			global_script.map_zoom3 = global_script.map_zoom;
			this.Repaint();
		}
	}
	
	if (global_script.settings.myExt4)
	{	
		if (global_script.settings.myExt4.isDone && !global_script.map_load4)
		{
			// Debug.Log("DONE4!!!!");
			
			if (!global_script.map4)
			{
				global_script.map4 = new Texture2D(800,768);
				global_script.map4.wrapMode = TextureWrapMode.Clamp;
			}
			global_script.settings.myExt4.LoadImageIntoTexture(global_script.map4);
			global_script.map_load4 = true;
			
			if (global_script.map4.width == 800 && global_script.map4.height == 800) {
				pixels = global_script.map4.GetPixels(0,32,800,768);
				
				global_script.map4.Resize(800,768);
				global_script.map4.SetPixels(0,0,800,768,pixels);
				global_script.map4.Apply();
			}
			
			offset_map4 = Vector2(0,0);
			// zoom = 0;
			// global_script.map_zoom_old = global_script.map_zoom;
			// zoom_pos = 0;
			zoom_pos4 = 0;
			zoom4 = 0;
			this.Repaint();
		}
	}
		
		if (global_script.map.export_heightmap_active)
		{
			if (global_script.map.bingKey[global_script.map.bingKey_selected].pulls > 48000) {
				check_free_key();
			}
			
			if (global_script.map.export_heightmap_continue) {
				global_script.map.export_heightmap_timeEnd = Time.realtimeSinceStartup;
			}
			
			for (var count_ext: int = 0;count_ext < global_script.map.elExt.Count;++count_ext)
			{
				if (global_script.map.elExt[count_ext].loaded && !global_script.map.export_heightmap.last_tile)
				{
					if (global_script.map.export_heightmap_continue) {
						// global_script.map.export_heightmap_continue = false;
						global_script.map.elExt[count_ext].bres = Vector2(32,32);
						if (export_heightmap_area.export_heightmap_not_fit) {
							if (global_script.map.export_heightmap.tile.x == global_script.map.export_heightmap.tiles.x-1) {
								global_script.map.elExt[count_ext].bres.x = export_heightmap_area.export_heightmap_bres.x;
							}
							if (global_script.map.export_heightmap.tile.y == global_script.map.export_heightmap.tiles.y-1) {
								global_script.map.elExt[count_ext].bres.y = export_heightmap_area.export_heightmap_bres.y;
							}
						}
						// global_script.map.elExt[count_ext].latlong_area = global_script.calc_latlong_area_by_tile(global_script.map.export_heightmap_area.latlong1,global_script.map.export_heightmap.tile,global_script.map.export_heightmap_zoom,32,Vector2(global_script.map.elExt[count_ext].bres.x,global_script.map.elExt[count_ext].bres.y));
						global_script.map.elExt[count_ext].latlong_area = global_script.calc_latlong_area_by_tile(global_script.map.export_heightmap_area.latlong1,global_script.map.export_heightmap.tile,global_script.map.export_heightmap_zoom,32,Vector2(global_script.map.elExt[count_ext].bres.x,global_script.map.elExt[count_ext].bres.y),export_heightmap_area.heightmap_offset_e);
						
						global_script.map.elExt[count_ext].tile.x = global_script.map.export_heightmap.tile.x;
						global_script.map.elExt[count_ext].tile.y = global_script.map.export_heightmap.tile.y;
						
						global_script.map.elExt[count_ext].url = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds="+global_script.map.elExt[count_ext].latlong_area.latlong2.latitude.ToString()+","+global_script.map.elExt[count_ext].latlong_area.latlong1.longitude.ToString()+","+global_script.map.elExt[count_ext].latlong_area.latlong1.latitude.ToString()+","+global_script.map.elExt[count_ext].latlong_area.latlong2.longitude.ToString()+"&rows="+global_script.map.elExt[count_ext].bres.y.ToString()+"&cols="+global_script.map.elExt[count_ext].bres.x.ToString()+"&heights=ellipsoid&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key;				
						// Debug.Log(s1);
						
						pull_elevation(count_ext);
						
						global_script.map.elExt[count_ext].loaded = false;
						
						if (jump_export_heightmap_tile()){global_script.map.export_heightmap.last_tile = true;}
					}
				}
				else
				{ 
					if (global_script.map.elExt[count_ext].pull)
					{
						if (global_script.map.elExt[count_ext].pull.error != null)
						{
							// Debug.Log("ERROR !!!!!!! x"+global_script.map.elExt[count_ext].tile.x+", y"+global_script.map.elExt[count_ext].tile.y);
							global_script.map.elExt[count_ext].pull.Dispose();
							pull_elevation(count_ext);
						}  
						
						if (Time.realtimeSinceStartup > global_script.map.time_start_elExt[count_ext]+15) {
							// Debug.Log("Time out elevation! "+count_ext);
							global_script.map.elExt[count_ext].pull.Dispose();
							pull_elevation(count_ext);
						}
						
						if (global_script.map.elExt[count_ext].pull.isDone)
						//if (!global_script.map.elExt[count_ext].loaded)
						{
							// global_script.map.export_heightmap_active = false;
							// Debug.Log("Done: "+count_ext);
							if (elConvert(count_ext))
							{
								global_script.map.elExt[count_ext].loaded = true;
							}
							// if (global_script.map.export_tile.x == global_script.map.export_tiles.x-1){script.terrains[0].terrain.terrainData.SetHeights(0,0,global_script.map.heights);}
						}
					}
				}
			}
			
			if (global_script.map.export_heightmap.last_tile)
			{
				if (check_elevation_pulls_done())
				{
					Debug.Log("Exporting heightmap Region: "+export_heightmap_region.name+" -> Area: "+export_heightmap_area.name+" done.");
					stop_elevation_pull(export_heightmap_region,export_heightmap_area);
				}
			}
		} 
		if (global_script.map.export_image_active)
		{
			if (global_script.map.bingKey[global_script.map.bingKey_selected].pulls > 48) {
				check_free_key();
			}
			
			if (global_script.map.export_image_continue) {
				global_script.map.export_image_timeEnd = Time.realtimeSinceStartup;
			}
			
			for (var count_texExt: int = 0;count_texExt < global_script.map.texExt.Count;++count_texExt)
			{
				if (global_script.map.texExt[count_texExt].converted && !global_script.map.export_image.last_tile) 
				{
					if (global_script.map.export_image_continue) 
					{
						var subtile: tile_class = new tile_class();
						 
						subtile.x = (global_script.map.export_image.subtiles.x*global_script.map.export_image.tile.x)+global_script.map.export_image.subtile.x;
						subtile.y = (global_script.map.export_image.subtiles.y*global_script.map.export_image.tile.y)+global_script.map.export_image.subtile.y;
						
						global_script.map.texExt[count_texExt].tile.x = global_script.map.export_image.tile.x;
						global_script.map.texExt[count_texExt].tile.y = global_script.map.export_image.tile.y;
						
						global_script.map.texExt[count_texExt].subtile.x = global_script.map.export_image.subtile.x; 
						global_script.map.texExt[count_texExt].subtile.y = global_script.map.export_image.subtile.y; 
						 
						// global_script.map.texExt[count_texExt].latlong_center = global_script.calc_latlong_center_by_tile(global_script.map.export_image_area.latlong1,global_script.map.export_image.tile,global_script.map.export_image.subtile,global_script.map.export_image.subtiles,global_script.map.export_image_zoom,512); 
						// global_script.map.texExt[count_texExt].latlong_area = global_script.calc_latlong_area_by_tile2(global_script.map.export_image_area.latlong1,subtile,global_script.map.export_image_zoom,512,Vector2(512,512));
						
						global_script.map.texExt[count_texExt].latlong_center = global_script.calc_latlong_center_by_tile(global_script.map.export_image_area.latlong1,global_script.map.export_image.tile,global_script.map.export_image.subtile,global_script.map.export_image.subtiles,global_script.map.export_image_zoom,512,export_image_area.image_offset_e); 
						global_script.map.texExt[count_texExt].latlong_area = global_script.calc_latlong_area_by_tile(global_script.map.export_image_area.latlong1,subtile,global_script.map.export_image_zoom,512,Vector2(512,512),export_image_area.image_offset_e);
						
						// Debug.Log("Load Tile :"+global_script.map.texExt[count_texExt].tile.x+","+global_script.map.texExt[count_texExt].tile.y+" Subtile :"+global_script.map.texExt[count_texExt].subtile.x+","+global_script.map.texExt[count_texExt].subtile.y);
						
						global_script.map.texExt[count_texExt].url = "http://dev.virtualearth.net/REST/v1/Imagery/Map/"+global_script.map.type.ToString()+"/"+global_script.map.texExt[count_texExt].latlong_center.latitude+","+global_script.map.texExt[count_texExt].latlong_center.longitude+"/"+global_script.map.export_image_zoom+"?&mapSize=512,544&key="+global_script.map.bingKey[global_script.map.bingKey_selected].key;
						// global_script.map.elExt[count_ext].url = "https://maps.googleapis.com/maps/api/staticmap?center="+global_script.map.texExt[count_texExt].latlong_center.latitude+","+global_script.map.texExt[count_texExt].latlong_center.longitude+"&zoom="+global_script.map.export_image_zoom+"&size=512x544&maptype=satellite";
						
						pull_image(count_texExt); 
						
						global_script.map.texExt[count_texExt].loaded = false;
						
						if (jump_export_image_tile())
						{
							global_script.map.export_image.last_tile = true;
						}
					}
				}
				else
				{ 
					if (global_script.map.texExt[count_texExt].pull && !global_script.map.texExt[count_texExt].converted)
					{
						if (global_script.map.texExt[count_texExt].pull.error != null)
						{
							// Debug.Log("ERROR !!!!!!! x"+global_script.map.texExt[count_ext].tile.x+", y"+global_script.map.texExt[count_ext].tile.y);
							global_script.map.texExt[count_texExt].pull.Dispose();
							pull_image(count_texExt);
						} 
						
						if (Time.realtimeSinceStartup > global_script.map.time_start_texExt[count_texExt]+20) {
							// Debug.Log("Time out! "+count_texExt);
							global_script.map.texExt[count_texExt].pull.Dispose();
							pull_image(count_texExt);
						}
						
						if (global_script.map.texExt[count_texExt].pull.isDone)
						{
							// Debug.Log("donE!!");
							if (texConvert(count_texExt))
							{
								// Debug.Log("Done: "+count_texExt);
								if (!global_script.map.texExt[count_texExt].error)
								{
									global_script.map.texExt[count_texExt].loaded = true;
								}
							}
							// if (global_script.map.export_tile.x == global_script.map.export_tiles.x-1){script.terrains[0].terrain.terrainData.SetHeights(0,0,global_script.map.heights);}
						}
					}
					else
					{
						// Debug.Log("pull not active");
					}
				}
			}
		}
	}
	
	function pick_done()
	{
		latlong_area = global_script.calc_latlong_area_rounded(current_area.upper_left,latlong_mouse,current_area.image_zoom,current_area.resolution,key.shift,8);
		current_area.lower_right = latlong_area.latlong2;
		current_area.center = global_script.calc_latlong_center(current_area.upper_left,current_area.lower_right,zoom,Vector2(position.width,position.height));
		requested_area = current_area;
		global_script.map.elExt_check_assign = true; 
		get_elevation_info(current_area.center);
		current_area.select = 0;
		global_script.map.mode = 0;
	}
	
	function check_image_tile_pulls_done(texExt_index: int)
	{
		var count_subtile: int = 0; 
		
		for (var count_Ext: int = 0;count_Ext < global_script.map.texExt.Count;++count_Ext)
		{
			if (global_script.map.texExt[count_Ext].tile.x == global_script.map.texExt[texExt_index].tile.x && global_script.map.texExt[count_Ext].tile.y == global_script.map.texExt[texExt_index].tile.y)
			{
				if (global_script.map.texExt[count_Ext].loaded)
				{
					++count_subtile;
					if (count_subtile == global_script.map.export_image.subtiles_total){return true;}
				}
			}
		}
		 
		return false;
	}
	
	function pull_elevation(ext_index: int) 
	{
		// Debug.Log("request: "+ext_index);
		global_script.map.elExt[ext_index].zero_error = 0;
		global_script.map.elExt[ext_index].pull = new WWW(global_script.map.elExt[ext_index].url); 
		global_script.map.time_start_elExt[ext_index] = Time.realtimeSinceStartup;
		// if (!global_script.map.elExt[ext_index].pull){Debug.Log("<<>>><<>>");}
		++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
	}
	
	function pull_image(ext_index: int)
	{
		// Debug.Log("request: "+ext_index);
		global_script.map.texExt[ext_index].converted = false;
		global_script.map.texExt[ext_index].zero_error = 0;
		global_script.map.texExt[ext_index].pull = new WWW(global_script.map.texExt[ext_index].url); 
		global_script.map.time_start_texExt[ext_index] = Time.realtimeSinceStartup;
		// if (!global_script.map.texExt[ext_index].pull){Debug.Log("<<>>><<>>");}
		++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
	}
	
	function check_elevation_pulls_done(): boolean
	{
		for (var count_Ext: int = 0;count_Ext < global_script.map.elExt.Count;++count_Ext)
		{
			if (!global_script.map.elExt[count_Ext].loaded){return false;}
		}
		
		return true;
	}
	
	function check_image_pulls_done(): boolean
	{
		for (var count_Ext: int = 0;count_Ext < global_script.map.texExt.Count;++count_Ext)
		{
			if (!global_script.map.texExt[count_Ext].converted){return false;}
		}
		
		return true;
	}
	
	function check_export_heightmap_call()
	{
		for (var count_region: int = 0;count_region < global_script.map.region.Count;++count_region) {
			for (var count_area: int = 0;count_area < global_script.map.region[count_region].area.Count;++count_area) {
				if (global_script.map.region[count_region].area[count_area].export_heightmap_call) {
					global_script.map.region[count_region].area[count_area].export_heightmap_call = false;
					start_elevation_pull(global_script.map.region[count_region],global_script.map.region[count_region].area[count_area]);
					return;
				}
			}
		}
	}
	
	function check_export_image_active()
	{
		for (var count_region: int = 0;count_region < global_script.map.region.Count;++count_region) {
			for (var count_area: int = 0;count_area < global_script.map.region[count_region].area.Count;++count_area) {
				if (global_script.map.region[count_region].area[count_area].export_image_call) {
					global_script.map.region[count_region].area[count_area].export_image_call = false;
					start_image_pull(global_script.map.region[count_region],global_script.map.region[count_region].area[count_area]);
					return;
				}
			}
		}
	}
	
	function stop_all_elevation_pull()
	{
		for (var count_region: int = 0;count_region < global_script.map.region.Count;++count_region) {
			stop_elevation_pull_region(global_script.map.region[count_region]);
		}
	}
	
	function stop_elevation_pull(region1: map_region_class,area1: map_area_class) 
	{
		area1.export_heightmap_active = false;
		
		global_script.map.export_heightmap_active = false;
		if (!global_script.map.export_image_active) {Application.runInBackground = false;}
		
		if (fs != null) {	
			fs.Close();
		}
		AssetDatabase.Refresh();
		check_export_heightmap_call();
	}
	
	function stop_elevation_pull_region(region1: map_region_class)
	{
		var count_area: int;
		
		for (count_area = 0;count_area < region1.area.Count;++count_area) {
			region1.area[count_area].export_heightmap_call = false;
		}
		for (count_area = 0;count_area < region1.area.Count;++count_area) {
			if (region1.area[count_area].export_heightmap_active) {
				stop_elevation_pull(region1,region1.area[count_area]);
			}
		}
	}
	
	function stop_all_image_pull() 
	{
		for (var count_region: int = 0;count_region < global_script.map.region.Count;++count_region) {
			stop_image_pull_region(global_script.map.region[count_region]);
		}
	}
	
	function stop_image_pull_region(region1: map_region_class)
	{
		var count_area: int;
		
		for (count_area = 0;count_area < region1.area.Count;++count_area) {
			region1.area[count_area].export_image_call = false;
		}
		for (count_area = 0;count_area < region1.area.Count;++count_area) {
			if (region1.area[count_area].export_image_active) {
				stop_image_pull(region1,region1.area[count_area],false);
			}
		}
	}
	
	function stop_image_pull(region1: map_region_class,area1: map_area_class,import_settings: boolean) 
	{
		area1.export_image_active = false;
		global_script.map.export_image_active = false;
		
		if (area1.export_image_import_settings && import_settings) {
			start_image_import_settings(area1);
		}
		
		if (global_script.map.file_tex2) {global_script.map.file_tex2.Close();}
		if (global_script.map.file_tex3) {global_script.map.file_tex3.Close();}
		
		if (!global_script.map.export_heightmap_active) {Application.runInBackground = false;}
		AssetDatabase.Refresh();
		
		check_export_image_active(); 
	}
	
	function start_image_pull_region(region1: map_region_class)
	{
		for (var count_area: int = 0;count_area < region1.area.Count;++count_area) {
			if (!region1.area[count_area].export_image_active && !region1.area[count_area].export_image_call) {
				start_image_pull(region1,region1.area[count_area]);
			}
		}
	}
	
	function start_elevation_pull_region(region1: map_region_class)
	{
		for (var count_area: int = 0;count_area < region1.area.Count;++count_area) {
			if (!region1.area[count_area].export_heightmap_active && !region1.area[count_area].export_heightmap_call) {
				start_elevation_pull(region1,region1.area[count_area]);
			}
		}
	}
	
	function start_elevation_pull(region1: map_region_class,area1: map_area_class)
	{
		if (area1.export_heightmap_active) {
			stop_elevation_pull(region1,area1);
			return;
		}
			
		if (area1.export_heightmap_call) {
			area1.export_heightmap_call = false;
			return;
		}
		
		if (global_script.map.export_heightmap_active) {
			area1.export_heightmap_call = true;
			return;
		}
		
		Application.runInBackground = true;
		
		global_script.map.export_heightmap.tiles.x = Mathf.Ceil(area1.heightmap_resolution.x/32);
		global_script.map.export_heightmap.tiles.y = Mathf.Ceil(area1.heightmap_resolution.y/32);
		
		// Debug.Log(global_script.map.export_heightmap.tiles.x+","+global_script.map.export_heightmap.tiles.y);
		
		if (global_script.map.export_heightmap.tiles.x != (area1.heightmap_resolution.x/32) || global_script.map.export_heightmap.tiles.y != (area1.heightmap_resolution.y/32)) {
			area1.export_heightmap_not_fit = true;
			area1.export_heightmap_bres.x = area1.heightmap_resolution.x-(Mathf.Floor(area1.heightmap_resolution.x/32)*32);
			area1.export_heightmap_bres.y = area1.heightmap_resolution.y-(Mathf.Floor(area1.heightmap_resolution.y/32)*32); 
			
			if (area1.export_heightmap_bres.x == 0){area1.export_heightmap_bres.x = 32;}
			if (area1.export_heightmap_bres.y == 0){area1.export_heightmap_bres.y = 32;}
			// Debug.Log("not fit! "+area1.export_heightmap_bres);
		} 
		else {  
			area1.export_heightmap_not_fit = false;
		}
		
		create_elExt(); 
		
		global_script.map.export_heightmap.last_tile = false;
		global_script.map.export_heightmap.tile.reset();
		global_script.map.export_heightmap_zoom = area1.heightmap_zoom;
		// global_script.map.export_pullIndex.reset(); 
		global_script.map.export_heightmap_area.latlong1 = area1.upper_left;
		global_script.map.export_heightmap_area.latlong2 = area1.lower_right;
		// global_script.map.heights = new float[(global_script.map.export_tiles.x*32),(global_script.map.export_tiles.y*32)+1];
		// global_script.map.heights = new float[2049,2049];
		if (!bytes) {bytes = new byte[2048];} 
		else {
			if (bytes.Length < 2048) {bytes = new byte[2048];}
		}
		open_stream(area1.export_heightmap_path,area1.export_heightmap_filename+".Raw");
		global_script.map.export_heightmap_timeStart = Time.realtimeSinceStartup;
		global_script.map.export_heightmap_timePause = Time.realtimeSinceStartup;
		global_script.map.export_heightmap_timeEnd = Time.realtimeSinceStartup;
		global_script.map.export_heightmap_active = true;
		area1.export_heightmap_active = true;
		
		export_heightmap_region = region1;
		export_heightmap_area = area1;
	}
	
	function start_image_pull(region1: map_region_class,area1: map_area_class)
	{
		if (area1.export_image_active) {
			stop_image_pull(region1,area1,false);
			return;
		}
		
		if (area1.export_image_call) {
			area1.export_image_call = false;
			return;
		}
		
		if (global_script.map.export_image_active) {
			area1.export_image_call = true;
			return;
		}
		
		Application.runInBackground = true;
		// Debug.Log("Export Area: "+area1.name+" images");
		
		global_script.map.export_image.tiles = area1.tiles;
		global_script.map.export_image.subtiles.x = area1.resolution/512;
		global_script.map.export_image.subtiles.y = area1.resolution/512;
		
		global_script.map.export_image.subtiles_total = Mathf.Pow(area1.resolution/512,2);
		
		create_texExt();  
		
		global_script.map.export_image.tile.x = current_area.start_tile.x;
		global_script.map.export_image.tile.y = current_area.start_tile.y;
		global_script.map.tex2_tile.x = current_area.start_tile.x;
		global_script.map.tex2_tile.y = current_area.start_tile.y;
		
		if (current_area.start_tile.x == current_area.tiles.x && current_area.start_tile.y == current_area.tiles.y) {
			global_script.map.export_image.last_tile = true;
		}
		else {
			global_script.map.export_image.last_tile = false;
		}
		
		global_script.map.export_tex2 = false;
		global_script.map.export_tex3 = false;
		
		global_script.map.export_image.subtile.reset();
		global_script.map.tex3_tile.reset();
		jump_export_tex3_tile();
		global_script.map.export_image.subtile_total = 0;
		global_script.map.export_image.subtile2_total = 0;
		global_script.map.export_tex3 = false;
		global_script.map.export_image_area.latlong1 = area1.upper_left;
		global_script.map.export_image_area.latlong2 = area1.lower_right; 
		
		export_image_region = region1;
		export_image_area = area1;
		
		if (!global_script.map.export_raw) { 
			if (!global_script.map.tex2)
			{
				global_script.map.tex2 = new Texture2D(area1.resolution,area1.resolution);
			}
			else if (global_script.map.tex2.width != area1.resolution)
			{
				global_script.map.tex2.Resize(area1.resolution,area1.resolution);
				global_script.map.tex2.Apply();
			}
			if (!global_script.map.tex3)
			{
				global_script.map.tex3 = new Texture2D(area1.resolution,area1.resolution);
			}
			else if (global_script.map.tex3.width != area1.resolution)
			{
				global_script.map.tex3.Resize(area1.resolution,area1.resolution);
				global_script.map.tex3.Apply();
			}
		}
		else {
			if (global_script.map.tex2) {
				global_script.map.tex2.Resize(0,0);
				global_script.map.tex2.Apply();
			}
			if (global_script.map.tex3) {	
				global_script.map.tex3.Resize(0,0);
				global_script.map.tex3.Apply();
			}
			
			if (global_script.map.file_tex2) {global_script.map.file_tex2.Close();}
			if (global_script.map.file_tex3) {global_script.map.file_tex3.Close();}
			
			// create_raw_files(export_image_area.export_image_path,0,0);
		}
		
		global_script.map.export_image_zoom = area1.image_zoom;	
		global_script.map.export_image_timeStart = Time.realtimeSinceStartup;
		global_script.map.export_image_timeEnd = Time.realtimeSinceStartup;
		global_script.map.export_image_timePause = Time.realtimeSinceStartup;
		global_script.map.export_image_active = true;
		area1.export_image_active = true;
	} 
	
	function jump_export_heightmap_tile(): boolean
	{
		++global_script.map.export_heightmap.tile.x;
		
		if (global_script.map.export_heightmap.tile.x >= global_script.map.export_heightmap.tiles.x)
		{
			global_script.map.export_heightmap.tile.x = 0;
			++global_script.map.export_heightmap.tile.y;
			if (global_script.map.export_heightmap.tile.y >= global_script.map.export_heightmap.tiles.y){this.Repaint();return true;}
		}
		
		return false;
	}
	
	function jump_export_image_tile(): boolean
	{
		++global_script.map.export_image.subtile.x;
		
		if (global_script.map.export_image.subtile.x >= global_script.map.export_image.subtiles.x)
		{
			global_script.map.export_image.subtile.x = 0;
			++global_script.map.export_image.subtile.y;
			if (global_script.map.export_image.subtile.y >= global_script.map.export_image.subtiles.y)
			{
				global_script.map.export_image.subtile.y = 0;
				++global_script.map.export_image.tile.x;
		
				if (global_script.map.export_image.tile.x >= global_script.map.export_image.tiles.x)
				{
					global_script.map.export_image.tile.x = 0;
					++global_script.map.export_image.tile.y;
					if (global_script.map.export_image.tile.y >= global_script.map.export_image.tiles.y){this.Repaint();return true;} 
				}		
			}
		}
		
		return false;
	}
	
	function jump_export_tex_tile(): boolean
	{
		++global_script.map.tex2_tile.x;
		
		if (global_script.map.tex2_tile.x >= global_script.map.export_image.tiles.x)
		{
			global_script.map.tex2_tile.x = 0;
			++global_script.map.tex2_tile.y;
			if (global_script.map.tex2_tile.y >= global_script.map.export_image.tiles.y){return true;}
		}
	}
	
	function jump_export_tex3_tile(): boolean
	{
		++global_script.map.tex3_tile.x;
		
		if (global_script.map.tex3_tile.x >= global_script.map.export_image.tiles.x)
		{
			global_script.map.tex3_tile.x = 0;
			++global_script.map.tex3_tile.y;
			if (global_script.map.tex3_tile.y >= global_script.map.export_image.tiles.y){return true;}
		}
	}
	
	function elConvert(elExt_index: int): boolean
	{
		if (!fs) {stop_elevation_pull_region(current_region);return;}
		// var ttt1: float = Time.realtimeSinceStartup;
		var index: int = global_script.map.elExt[elExt_index].pull.text.IndexOf("elevations");
			
		var substring1: String = global_script.map.elExt[elExt_index].pull.text.Substring(index+13);
			
		var index2: int = substring1.IndexOf("]");
			
		// Debug.Log("index: "+index2);
			
		substring1 = substring1.Substring(0,index2);
		
		// Debug.Log(substring1);
			
		var numberS: String;
		var charS: char;
		var number: double;
		var number_index: int = 0;
		var x: int;
		var y: int;
		var xx: int;
		var yy: int;
		var value_int: int;
		var height: double;
		var byte_hi: byte;
		var byte_lo: byte;
		var i: int = 0;
		var zerodata: int = 0;
				
		xx = global_script.map.elExt[elExt_index].tile.x*32;
		yy = global_script.map.elExt[elExt_index].tile.y*32;
		
		// var size: int = global_script.map.elExt[elExt_index].bres.x*global_script.map.elExt[elExt_index].bres.y*2;
		// if (bytes.Length != size) {bytes = new byte[size];}
						
		for (var count_index: int = 0;count_index < substring1.Length;++count_index)
		{
			 charS = substring1[count_index];
				 
			 if (charS != ",")
			 {
				numberS += charS;	 
			 }
			 	 	 
			 if (charS == "," || count_index == substring1.Length-1)
			 {
			 	number = Int16.Parse(numberS);
			 	
			 	// x = number_index-((number_index/global_script.map.elExt[elExt_index].bres.x)*global_script.map.elExt[elExt_index].bres.x);
			 	// y = global_script.map.elExt[elExt_index].bres.y-(number_index/global_script.map.elExt[elExt_index].bres.x);
			 	
			 	// x += xx;
			 	// y += yy;
			 	
			 	height = ((number+100)*(65535.0/9000.0));
			 	
			 	if (number == 0)
			 	{
			 		++zerodata;
			 		if (zerodata > 80)
			 		{
			 			//Debug.Log("error in heightmap data!");
			 			++global_script.map.elExt[elExt_index].zero_error;
			 		
			 			if (++global_script.map.elExt[elExt_index].zero_error < 3) {
				 			global_script.map.elExt[elExt_index].error = true;
				 			global_script.map.elExt[elExt_index].pull = new WWW(global_script.map.elExt[elExt_index].url);  
				 			++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
							return false;
						}
					}
			 	}
			 	
			 	value_int = height;
				
				byte_hi = value_int >> 8; 
				byte_lo = value_int-(byte_hi << 8);
					
				bytes[i++] = byte_lo;
				bytes[i++] = byte_hi;
				
			 	// Debug.Log(number);
			 	numberS = String.Empty;
				++number_index;
			 }
			 
		}
		
		global_script.map.elExt[elExt_index].error = false;
		
		for (var yb: int = 0;yb < global_script.map.elExt[elExt_index].bres.y;++yb)
		{
			// fs.Position = ((yy+((global_script.map.elExt[elExt_index].bres.y-1)-yb))*(yy*export_heightmap_area.heightmap_resolution.x*2))+(xx*2);
			fs.Position = (yy*export_heightmap_area.heightmap_resolution.x*2)+(xx*2)+(((global_script.map.elExt[elExt_index].bres.y-1)-yb)*(export_heightmap_area.heightmap_resolution.x*2));
			fs.Write(bytes,yb*global_script.map.elExt[elExt_index].bres.x*2,global_script.map.elExt[elExt_index].bres.x*2);	
		}
		// Debug.Log("numbers in string: "+number_index);
		// Debug.Log(global_script.map.elExt[elExt_index].bres.x+","+global_script.map.elExt[elExt_index].bres.y);
		
		return true;
	}
	
	function texConvert(texExt_index: int): boolean
	{
		var subtile: tile_class = new tile_class();
		
		if ((global_script.map.texExt[texExt_index].tile.x == global_script.map.tex2_tile.x && global_script.map.texExt[texExt_index].tile.y == global_script.map.tex2_tile.y) || (export_image_area.resolution == 512))
		{
			if (!global_script.map.tex1){global_script.map.tex1 = new Texture2D(512,512);}
			
			global_script.map.texExt[texExt_index].pull.LoadImageIntoTexture(global_script.map.tex1);
					
			pixels = global_script.map.tex1.GetPixels(0,32,512,512);
			
			subtile.x = (global_script.map.texExt[texExt_index].tile.x*global_script.map.export_image.subtiles.x)+global_script.map.texExt[texExt_index].subtile.x;
			subtile.y = (global_script.map.texExt[texExt_index].tile.y*global_script.map.export_image.subtiles.y)+global_script.map.texExt[texExt_index].subtile.y;
			
			if (check_image_error(texExt_index))
			{
				++global_script.map.texExt[texExt_index].zero_error;
			 	
			 	if (global_script.map.texExt[texExt_index].zero_error < 5) {
			 		global_script.map.texExt[texExt_index].pull = new WWW(global_script.map.texExt[texExt_index].url); 
					global_script.map.time_start_texExt[texExt_index] = Time.realtimeSinceStartup;
					++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
					return false; 
				}
				// Debug.Log(global_script.map.texExt[texExt_index].zero_error);
			}
			
			// Debug.Log("write tex2 :"+texExt_index+"   tile: "+global_script.map.texExt[texExt_index].tile.x+","+global_script.map.texExt[texExt_index].tile.y+" subtile: "+global_script.map.texExt[texExt_index].subtile.x+","+global_script.map.texExt[texExt_index].subtile.y);
			if (!global_script.map.export_raw) {
				global_script.map.tex2.SetPixels(global_script.map.texExt[texExt_index].subtile.x*512,(global_script.map.export_image.subtiles.y-1-global_script.map.texExt[texExt_index].subtile.y)*512,512,512,pixels);
			}
			else {
				if (!global_script.map.export_tex2) {
					create_raw_files (export_image_area.export_image_path,texExt_index,2);
					global_script.map.export_tex2 = true;
				}
				
				if (!export_texture_to_raw (global_script.map.file_tex2,Vector2(global_script.map.texExt[texExt_index].subtile.x*512,(global_script.map.export_image.subtiles.y-1-global_script.map.texExt[texExt_index].subtile.y)*512))) {
					return true;
				}
			}
			
			global_script.map.texExt[texExt_index].converted = true;
			
			++global_script.map.export_image.subtile_total;
			
			if ((global_script.map.export_image.subtile_total == global_script.map.export_image.subtiles_total) || (export_image_area.resolution == 512))
			{
				// global_script.map.tex1.Apply();
				
				var filename: String;
				if (!global_script.map.export_raw) {
					if (export_image_area.resolution == 512) {
						filename = export_image_area.export_image_filename+"_x"+global_script.map.texExt[texExt_index].tile.x+"_y"+global_script.map.texExt[texExt_index].tile.y;
					}
					else {
						filename = export_image_area.export_image_filename+"_x"+global_script.map.tex2_tile.x+"_y"+global_script.map.tex2_tile.y;
					}
				}
				
				if (export_image_area.preimage_export_active && !export_image_area.preimage_save_new) {
					global_script.map.preimage_edit.y1 = 0;
					global_script.map.preimage_edit.convert_texture (global_script.map.tex2,global_script.map.tex2,global_script.map.tex2.width,global_script.map.tex2.height,false);
				}
				
				if (export_image_area.export_image_world_file) {
					// var latlong: latlongl_class = global_script.latlong_to_pixel2(global_script.map.texExt[texExt_index].latlong_area.latlong1,export_image_area.image_zoom);
					// Debug.Log(export_image_area.export_image_path+"/"+filename+".jgw"+"  -> tile: "+global_script.map.texExt[texExt_index].tile.x+","+global_script.map.texExt[texExt_index].tile.y);
					var latlong_area: latlong_area_class = global_script.calc_latlong_area_by_tile2(global_script.map.export_image_area.latlong1,global_script.map.texExt[texExt_index].tile,global_script.map.export_image_zoom,export_image_area.resolution,Vector2(export_image_area.resolution,export_image_area.resolution));
					var arc_longitude: double = (latlong_area.latlong2.longitude-latlong_area.latlong1.longitude)/export_image_area.resolution;
					var arc_latitude: double = (latlong_area.latlong2.latitude-latlong_area.latlong1.latitude)/export_image_area.resolution;
					var sw: StreamWriter = new StreamWriter(export_image_area.export_image_path+"/"+filename+".jgw");
					sw.WriteLine(arc_longitude.ToString());
					sw.WriteLine("0");
					sw.WriteLine("0");
					sw.WriteLine((arc_latitude).ToString());
					// sw.WriteLine(pixel.x.ToString());
					// sw.WriteLine(pixel.y.ToString());
					sw.WriteLine(latlong_area.latlong1.longitude);
					sw.WriteLine(latlong_area.latlong1.latitude);
					sw.Close();
				}
				
				jump_export_tex_tile();
				jump_export_tex3_tile();
				
				// track start image position
				if (global_script.map.track_tile) {
					export_image_area.start_tile.x = global_script.map.tex2_tile.x;
					export_image_area.start_tile.y = global_script.map.tex2_tile.y;
				}
				
				if (global_script.map.export_jpg) {
					export_texture_as_jpg(export_image_area.export_image_path+"/"+filename+".jpg",global_script.map.tex2,global_script.map.export_jpg_quality);
					
				}
				
				if (global_script.map.export_png) {
					export_texture_to_file(export_image_area.export_image_path,filename,global_script.map.tex2);
				}
				
				if (export_image_area.image_stop_one) {stop_image_pull(export_image_region,export_image_area,true);}
				
				if (global_script.map.export_tex3)
				{
					global_script.map.export_image.subtile_total = global_script.map.export_image.subtile2_total;
					global_script.map.export_image.subtile2_total = 0; 
					global_script.map.export_tex3 = false;
					//if (!global_script.map.tex_swapped) 
					//{
						if (!global_script.map.export_raw) {
							var tex4: Texture2D = global_script.map.tex2;
							global_script.map.tex2 = global_script.map.tex3;
							global_script.map.tex3 = tex4;
						}
						else {
							global_script.map.file_tex2.Close();
							
							var file_tex4: FileStream = global_script.map.file_tex2; 
							global_script.map.file_tex2 = global_script.map.file_tex3;
							global_script.map.file_tex3 = file_tex4; 
						}
						global_script.map.tex_swapped = true;
					/*}
					else
					{
						var tex4b: Texture2D = global_script.map.tex3;
						global_script.map.tex3 = global_script.map.tex2;
						global_script.map.tex2 = tex4b;
						global_script.map.tex_swapped = false;
					}
					// global_script.map.tex2.SetPixels(0,0,global_script.map.tex2.width,global_script.map.tex2.height,global_script.map.tex3.GetPixels(0,0,global_script.map.tex3.width,global_script.map.tex3.height));
					*/
				}
				else
				{
					if (global_script.map.export_image.last_tile && check_image_pulls_done())
					{
						Debug.Log("Exporting image Region: "+export_image_region.name+" -> Area: "+export_image_area.name+" done.");
						if (global_script.map.track_tile) {
							export_image_area.start_tile.x = 0;
							export_image_area.start_tile.y = 0;
						}
						stop_image_pull(export_image_region,export_image_area,true);
					}
					global_script.map.export_image.subtile_total = 0;
					
					if (global_script.map.export_raw) {
						global_script.map.file_tex2.Close();
					}
					global_script.map.export_tex2 = false;
				}
			}
			return true;
		}
		else
		{
			if (global_script.map.texExt[texExt_index].tile.x == global_script.map.tex3_tile.x && global_script.map.texExt[texExt_index].tile.y == global_script.map.tex3_tile.y)
			{
				if (global_script.map.export_image.subtile2_total < global_script.map.export_image.subtiles_total-1)
				{
					if (!global_script.map.export_tex3) {
						create_raw_files (export_image_area.export_image_path,texExt_index,1);
					}
					
					global_script.map.texExt[texExt_index].pull.LoadImageIntoTexture(global_script.map.tex1);
							
					pixels = global_script.map.tex1.GetPixels(0,32,512,512);
							
					subtile.x = (global_script.map.texExt[texExt_index].tile.x*global_script.map.export_image.subtiles.x)+global_script.map.texExt[texExt_index].subtile.x;
					subtile.y = (global_script.map.texExt[texExt_index].tile.y*global_script.map.export_image.subtiles.y)+global_script.map.texExt[texExt_index].subtile.y;
					
					if (check_image_error(texExt_index))
					{
						++global_script.map.texExt[texExt_index].zero_error;
			 	
					 	if (++global_script.map.texExt[texExt_index].zero_error < 5) {
							global_script.map.texExt[texExt_index].pull = new WWW(global_script.map.texExt[texExt_index].url); 
							global_script.map.time_start_texExt[texExt_index] = Time.realtimeSinceStartup;
							++global_script.map.bingKey[global_script.map.bingKey_selected].pulls;
							return false; 
						}
						// Debug.Log(global_script.map.texExt[texExt_index].zero_error);
					}
					
					// Debug.Log("write tex3 tile: "+global_script.map.texExt[texExt_index].tile.x+","+global_script.map.texExt[texExt_index].tile.y+" subtile: "+global_script.map.texExt[texExt_index].subtile.x+","+global_script.map.texExt[texExt_index].subtile.y);
					if (!global_script.map.export_raw) {
						global_script.map.tex3.SetPixels(global_script.map.texExt[texExt_index].subtile.x*512,(global_script.map.export_image.subtiles.y-1-global_script.map.texExt[texExt_index].subtile.y)*512,512,512,pixels);
					}
					else {
						if (!export_texture_to_raw (global_script.map.file_tex3,Vector2(global_script.map.texExt[texExt_index].subtile.x*512,(global_script.map.export_image.subtiles.y-1-global_script.map.texExt[texExt_index].subtile.y)*512))) {
							return true;  
						}
					}
					
					global_script.map.texExt[texExt_index].converted = true;
					
					++global_script.map.export_image.subtile2_total;
					global_script.map.export_tex3 = true;
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return false;
			}
		}
	}
	
	function check_image_error(texExt_index: int): boolean
	{
		var white: int = 0;
		var row: int = 0;
		var y: int;
		var x: int;
		var color_fault: Color = Color(172.0/255.0,199.0/255.0,242.0/255);
		
		for (y = 0;y < 480;y += 4)
		{
			for (x = 0;x < 512;x += 4)
			{
				if (pixels[(y*512)+x].r == color_fault.r && pixels[(y*512)+x].g == color_fault.g && pixels[(y*512)+x].b == color_fault.b)
				{
					++white;
					// Debug.Log(white);
					if (white == 5) 
					{
						// Debug.Log("Error found in image");
						global_script.map.texExt[texExt_index].error = true;
						return true;
					}
				}
			}
		}
		global_script.map.texExt[texExt_index].error = false;
		return false; 
	}
	
	function create_elExt()
	{
		global_script.map.elExt.Clear();
		global_script.map.time_start_elExt.Clear();
		
		for (var count_ext: int = 0;count_ext < global_script.map.export_elExt;++count_ext)
		{
			global_script.map.elExt.Add(new ext_class());
			global_script.map.time_start_elExt.Add(0);
			global_script.map.elExt[count_ext].loaded = true;
		}
	}
	
	function create_texExt()
	{
		global_script.map.texExt.Clear();
		global_script.map.time_start_texExt.Clear();
		
		for (var count_ext: int = 0;count_ext < global_script.map.export_texExt;++count_ext)
		{
			global_script.map.texExt.Add(new ext_class());
			global_script.map.time_start_texExt.Add(0);
			global_script.map.texExt[count_ext].loaded = true;
			global_script.map.texExt[count_ext].converted = true;
		}
	}
	
	function open_stream(path: String,fileName: String)
	{
		fs = new FileStream(path+"/"+fileName,FileMode.Create);
	}
	
	function calc_heightmap_settings(area: map_area_class)
	{
		area.heightmap_scale = global_script.calc_latlong_area_resolution(area.center,area.heightmap_zoom);
		area.heightmap_resolution.x = Mathf.Round(area.size.x/area.heightmap_scale);
		area.heightmap_resolution.y = Mathf.Round(area.size.y/area.heightmap_scale);
	}
		
	function calc_terrain_heightmap_resolution()
	{
		current_area.terrain_heightmap_resolution = current_area.heightmap_resolution.x/current_area.tiles.x;
		
		if (current_area.terrain_heightmap_resolution < 33) {current_area.terrain_heightmap_resolution = 33;current_area.terrain_heightmap_resolution_select = 0;}
		else if (current_area.terrain_heightmap_resolution < 65) {current_area.terrain_heightmap_resolution = 65;current_area.terrain_heightmap_resolution_select = 1;}
		else if (current_area.terrain_heightmap_resolution < 129) {current_area.terrain_heightmap_resolution = 129;current_area.terrain_heightmap_resolution_select = 2;}
		else if (current_area.terrain_heightmap_resolution < 257) {current_area.terrain_heightmap_resolution = 257;current_area.terrain_heightmap_resolution_select = 3;}
		else if (current_area.terrain_heightmap_resolution < 513) {current_area.terrain_heightmap_resolution = 513;current_area.terrain_heightmap_resolution_select = 4;}
		else if (current_area.terrain_heightmap_resolution < 1025) {current_area.terrain_heightmap_resolution = 1025;current_area.terrain_heightmap_resolution_select = 5;}
		else if (current_area.terrain_heightmap_resolution < 2049) {current_area.terrain_heightmap_resolution = 2049;current_area.terrain_heightmap_resolution_select = 6;}
		else if (current_area.terrain_heightmap_resolution < 4097) {current_area.terrain_heightmap_resolution = 4097;current_area.terrain_heightmap_resolution_select = 7;}
	}
	
	function calc_24_hours(): String
	{
		var hours: int = 0;
		var minutes: int = 0;
		var delta_day: int = (System.DateTime.Now.Day-global_script.map.bingKey[global_script.map.bingKey_selected].pulls_startDay);
		
		if (delta_day > 0)
		{
			hours = (delta_day*24)-global_script.map.bingKey[global_script.map.bingKey_selected].pulls_startHour+System.DateTime.Now.Hour;	
		}
		else
		{
			hours += System.DateTime.Now.Hour-global_script.map.bingKey[global_script.map.bingKey_selected].pulls_startHour;
		}
		
		if (global_script.map.bingKey[global_script.map.bingKey_selected].pulls_startMinute > System.DateTime.Now.Minute)
		{
			--hours;
			minutes = 60-(global_script.map.bingKey[global_script.map.bingKey_selected].pulls_startMinute - System.DateTime.Now.Minute);
		}
		else
		{
			minutes = System.DateTime.Now.Minute - global_script.map.bingKey[global_script.map.bingKey_selected].pulls_startMinute;
		}
		
		hours = 23-hours;
		minutes = 60-minutes;
		
		if (minutes == 60){++hours;minutes = 0;}
		
		if (hours < 0){global_script.map.bingKey[global_script.map.bingKey_selected].reset();}
		
		return (hours.ToString()+":"+minutes.ToString("D2"));
	}
	
	function export_texture_as_jpg(file: String,texture: Texture2D,quality: int)
	{
		var encoder:JPGEncoder_class = new JPGEncoder_class(texture, quality);
		
		do
		{
		
		}
		while(!encoder.isDone);
		
		File.WriteAllBytes(file,encoder.GetBytes());

		/*
		var bitmap: Bitmap = new Bitmap(source_file);
		var jpgEncoder: ImageCodecInfo = GetEncoder(ImageFormat.Jpeg);
		var parameters: EncoderParameters = new EncoderParameters(1);
		
		var encoder: System.Drawing.Imaging.Encoder = System.Drawing.Imaging.Encoder.Quality;
		
		var parameter: EncoderParameter = new EncoderParameter(encoder,quality);
		
		parameters.Param[0] = parameter;
		
		bitmap.Save(destination_file,jpgEncoder,parameters);
		
		bitmap.Dispose();
		*/
	}
	
	/*
	function GetEncoder(format: ImageFormat): ImageCodecInfo
	{
		var codecs: ImageCodecInfo[] = ImageCodecInfo.GetImageDecoders();
		
		for (var count_codec: int = 0;count_codec < codecs.Length;++count_codec)
		{
			codec = codecs[count_codec];
			if (codec.FormatID == format.Guid)
			{
				// Debug.Log(codec.FormatID);
				return codec;
			}
		}
		Debug.Log("codec not found!");
		return null;
	}
	*/
	
	function export_texture_to_file(path: String,file: String,export_texture: Texture2D)
	{
		var bytes1: byte[] = export_texture.EncodeToPNG();
		File.WriteAllBytes(path+"/"+file+".png",bytes1);	
	}
	
	function create_raw_files(path: String,texExt_index: int,mode: int)
	{
		if (export_image_area.resolution == 512) {
			global_script.map.file_tex2 = new FileStream (path+"/"+export_image_area.export_image_filename+"_x"+global_script.map.texExt[texExt_index].tile.x+"_y"+global_script.map.texExt[texExt_index].tile.y+".raw",FileMode.Create);
		}
		else {
			if (mode == 0 || mode == 2) {
				global_script.map.file_tex2 = new FileStream (path+"/"+export_image_area.export_image_filename+"_x"+global_script.map.tex2_tile.x+"_y"+global_script.map.tex2_tile.y+".raw",FileMode.Create);
				// Debug.Log (path+"/"+export_image_area.export_image_filename+"_x"+global_script.map.tex2_tile.x+"_y"+global_script.map.tex2_tile.y+".raw");
			}
			if (mode == 0 || mode == 1) {
				global_script.map.file_tex3 = new FileStream (path+"/"+export_image_area.export_image_filename+"_x"+global_script.map.tex3_tile.x+"_y"+global_script.map.tex3_tile.y+".raw",FileMode.Create);
				// Debug.Log (path+"/"+export_image_area.export_image_filename+"_x"+global_script.map.tex3_tile.x+"_y"+global_script.map.tex3_tile.y+".raw");
			}
		}
	}
	
	function export_texture_to_raw(file_tex: FileStream,offset: Vector2): boolean
	{
		// var export_file: FileStream;
		// var pixels2: Color[];
		var y: int;
		var x: int;
		var width: int = export_image_area.resolution*3;
		var byte1: byte[] = new byte[1536];
		
		if (!file_tex) {
			Debug.Log("Image exporting is interupted, please start again.");
			stop_all_image_pull();
			return false;
		}
		
		file_tex.Position = (width*(export_image_area.resolution-512-offset.y))+(offset.x*3);
		
		for (y = 511;y >= 0;--y) {
			for (x = 0;x < 512;++x) {
				byte1[x*3] = pixels[(y*512)+x].r*255;
				byte1[(x*3)+1] = pixels[(y*512)+x].g*255;
				byte1[(x*3)+2] = pixels[(y*512)+x].b*255;
			}
			
			file_tex.Write(byte1,0,1536);
			file_tex.Seek ((width)-(1536),SeekOrigin.Current);
		}
		
		return true;
	}
	
	var combine_width: ulong;
	var combine_height: ulong;
	var combine_length: ulong;
	var combine_area: map_area_class;	
	var combine_import_filename: String;
	var combine_import_path: String;
	var combine_byte: byte[];
	var combine_import_file: FileStream;
	var combine_export_file: FileStream;
	var combine_export_path: String;
	var combine_export_filename: String;
	var combine_x: int;
	var combine_y: int;
	var combine_y1: int;
	var combine_time: float;
	var combine_generate: boolean;
	var slice_generate: boolean;
	var combine_progress: float;
	var combine_call: boolean;
	var combine_pixels: Color[];
		
	
	function combine_textures_begin(area1: map_area_class,path: String,file: String)
	{
		if (combine_export_file){combine_export_file.Close();}
		if (combine_import_file){combine_import_file.Close();} 
		
		combine_area = area1;
		combine_width = area1.resolution*3*area1.tiles.x;	
		combine_height = combine_width*area1.resolution;
		combine_length = ((area1.resolution*area1.resolution*3))*(area1.tiles.x*area1.tiles.y);
		
		combine_import_path = area1.export_image_path+"/";
		
		if (combine_export_file) {combine_export_file.Close();}
		combine_export_file = new FileStream(path+"/"+file+"_combined.raw",FileMode.Create);
		combine_export_file.SetLength (combine_length);
		combine_call = false;
			
		combine_byte = new byte[area1.resolution*3];		
		combine_y = 0;
		combine_x = 0;
		combine_y1 = 0;
		combine_generate = true;
		Application.runInBackground = true;
	}
	
	function combine_textures() 
	{
		var y: int;
		var x: int;
		var y1: int;
		var x1: int;
		
		combine_time = Time.realtimeSinceStartup;
		
		for (y = combine_y;y < combine_area.tiles.y;++y) {
			for (x = combine_x;x < combine_area.tiles.x;++x) {
				if (!combine_call) {
					if (combine_import_file) {combine_import_file.Close();}
					combine_import_filename = combine_area.export_image_filename+"_x"+x+"_y"+y;
					if (File.Exists(combine_import_path+combine_import_filename+".raw")) {
						combine_import_file = new FileStream(combine_import_path+combine_import_filename+".raw",FileMode.Open);
					}
					else {
						Debug.Log(combine_import_path+combine_import_filename+".raw"+" does not exist");
						combine_generate = false;
						combine_export_file.Close();
						return;
					}
					combine_export_file.Seek ((combine_height*y)+(combine_area.resolution*3*x),SeekOrigin.Begin);
				}
				
				for (y1 = combine_y1;y1 < combine_area.resolution;++y1) { 
					combine_import_file.Read (combine_byte,0,combine_area.resolution*3);
					combine_export_file.Write (combine_byte,0,combine_area.resolution*3);
					
					combine_export_file.Seek (combine_width-(combine_area.resolution*3),SeekOrigin.Current);
					if (Time.realtimeSinceStartup-combine_time > (1.0/global_script.target_frame))
					{
						combine_call = true;
						combine_y1 = y1+1;
						combine_y = y;
						combine_x = x;
						// if (mode == 2) {time = Time.realtimeSinceStartup-time_start;}
						// Debug.Log("mode: "+mode+", "+y1);
						return;
					}
				}
				combine_call = false; 
				
				combine_y1 = 0;
			}
			combine_x = 0;
		}
		
		combine_export_file.Close();
		combine_generate = false;
	}
			
	function slice_textures_begin(area1: map_area_class,path: String,file: String) 
	{
		combine_area = area1;
		combine_export_path = area1.export_image_path+"/";
		combine_byte = new byte[area1.resolution*3];
		
		combine_width = area1.resolution*3*area1.tiles.x;
		combine_height = combine_width*area1.resolution;
		combine_length = ((area1.resolution*area1.resolution*3))*(area1.tiles.x*area1.tiles.y);
		
		if (!global_script.map.preimage_edit.save_new) {
			combine_import_file = new FileStream(path+"/"+file+"_combined2.raw",FileMode.Open);
		}
		else {
			combine_import_file = new FileStream(current_area.preimage_path+"/"+current_area.preimage_filename+".raw",FileMode.Open);
		}
		
		combine_pixels = new Color[area1.resolution];
		
		if (!global_script.map.tex2) {
			global_script.map.tex2 = new Texture2D(area1.resolution,area1.resolution);
		}
		else if (!global_script.map.tex2.width != area1.resolution) {
			global_script.map.tex2.Resize (area1.resolution,area1.resolution); 
			global_script.map.tex2.Apply();
		}
		
		combine_call = false;
		combine_y = 0;
		combine_x = 0;
		combine_y1 = 0;
		slice_generate = true;
		Application.runInBackground = true;
	}
	
	function slice_textures() 
	{
		var y: int;
		var x: int;
		var y1: int;
		var x1: int;
		
		combine_time = Time.realtimeSinceStartup;
		
		for (y = combine_y;y < combine_area.tiles.y;++y) {
			for (x = combine_x;x < combine_area.tiles.x;++x) {
				if (!combine_call) {
					combine_export_filename = combine_area.export_image_filename+"_x"+x+"_y"+y;
					// import_file = new FileStream(import_path+import_filename+".raw",FileMode.Open);
					combine_import_file.Seek ((combine_height*y)+(combine_area.resolution*3*x),SeekOrigin.Begin);
					// Debug.Log((combine_height*y)+(combine_area.resolution*3*x));
					 
				}
				
				for (y1 = combine_y1;y1 < combine_area.resolution;++y1) {
					combine_import_file.Read (combine_byte,0,combine_area.resolution*3);
					for (x1 = 0;x1 < combine_area.resolution;++x1) {
						// import_file.Read(byte1,0,area1.resolution*3);
						combine_pixels[x1] = Color((combine_byte[(x1*3)]*1.0)/255,(combine_byte[(x1*3)+1]*1.0)/255,(combine_byte[(x1*3)+2]*1.0)/255);
					}
					global_script.map.tex2.SetPixels(0,combine_area.resolution-y1-1,combine_area.resolution,1,combine_pixels);
					combine_import_file.Seek (combine_width-(combine_area.resolution*3),SeekOrigin.Current);
					if (Time.realtimeSinceStartup-combine_time > (1.0/global_script.target_frame))
					{
						combine_call = true;
						combine_y1 = y1+1;
						combine_y = y; 
						combine_x = x;
						// if (mode == 2) {time = Time.realtimeSinceStartup-time_start;}
						// Debug.Log("mode: "+mode+", "+y1);
						return;
					}
				}
				
				combine_y1 = 0;
				combine_call = false;
				// Debug.Log("export: "+combine_export_path+combine_export_filename+".jpg");
				export_texture_as_jpg(combine_export_path+combine_export_filename+".jpg",global_script.map.tex2,global_script.map.export_jpg_quality);
				// import_file.Close();
				// return;
			}
			combine_x = 0;
		}
		
		combine_import_file.Close();
		slice_generate = false;
	}
	
	function keyHelp()
	{
		GUI.color = global_script.map.backgroundColor;
		help_rect = Rect(350,60+gui_y2,450,100);
		EditorGUI.DrawPreviewTexture(help_rect,global_script.tex2);
		
		GUI.color = Color.red;
		EditorGUI.LabelField(Rect(350,60+gui_y2,200,20),"Mouse: ",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(355,85+gui_y2,200,20),"Navigate Around",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(538,85+gui_y2,250,20),"Hold left mouse button and drag",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(355,104+gui_y2,200,20),"Goto position",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(538,104+gui_y2,250,20),"Double click left mouse button",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(355,123+gui_y2,200,20),"Zoom",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(538,123+gui_y2,200,20),"Mouse scroll wheel",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(355,142+gui_y2,200,20),"Elevation Info",EditorStyles.boldLabel);
		EditorGUI.LabelField(Rect(538,142+gui_y2,200,20),"Right mouse button",EditorStyles.boldLabel);
		
		GUI.color = Color.white;
	}
	
	function texture_fill(texture: Texture2D,color: Color,apply: boolean)
	{
		var width: int = texture.width;
		var height: int = texture.height;
		
		for (var y: int = 0;y < height;++y)
		{
			for (var x: int = 0;x < width;++x)
			{
				texture.SetPixel(x,y,color);
			}
		}
		
		if (apply){texture.Apply();}
	}
	
	function sec_to_timeMin(seconds: float,display_seconds: boolean): String
	{
		var minutes: int = seconds/60;
		seconds -= minutes*60;
		
		if (minutes == 0)
		{
			return (seconds.ToString("F2"));
		}
		
		var roundSeconds: int = seconds;
		seconds -= roundSeconds;
		
		var miliSeconds: int = (seconds*100);
		
		if (display_seconds)
		{
			return (minutes.ToString()+":"+roundSeconds.ToString("D2")+"."+miliSeconds.ToString("D2"));
		}
		else
		{
			return (minutes.ToString()+":"+roundSeconds.ToString("D2"));
		}
	}
	
	function check_free_key()
	{
		for (var count_key: int = 0;count_key < global_script.map.bingKey.Count;++count_key) {
			if (global_script.map.bingKey[count_key].pulls < 48000) {
				global_script.map.bingKey_selected = count_key;
				return;
			}
		}
	}
	
	function create_worldcomposer_parent(): GameObject
	{
		var object: GameObject = new GameObject();
		
		object.name = "_WorldComposer";
		object.transform.position = Vector3(0,0,0);
		
		return object;
	}
	
	function parent_terraincomposer_children()
	{
		var parent: GameObject;
		 
		Global_Settings = GameObject.Find("global_settings");
		
		if (Global_Settings) {		
			if (!terraincomposer) {
				parent = GameObject.Find("_WorldComposer");
				if (!parent) {parent = create_worldcomposer_parent();}
				Global_Settings.transform.parent = parent.transform;
			}
			else {
				parent = GameObject.Find("_TerrainComposer");
				Global_Settings.transform.parent = parent.transform;
				
				var worldcomposer_parent: GameObject = GameObject.Find("_WorldComposer");
				if (worldcomposer_parent) {
					DestroyImmediate(worldcomposer_parent);
				}
			}
		}
	}
	
	function load_global_settings()
    {
    	var path: String = "Assets/TerrainComposer/Templates/global_settings.prefab";
    	
    	if (!File.Exists(Application.dataPath+"/TerrainComposer/Templates/global_settings.prefab")) {
    		 if (!File.Exists(Application.dataPath+"/TerrainComposer/Templates/global_settings 1.prefab")) {
    		 	FileUtil.CopyFileOrDirectory ("Assets/TerrainComposer/Templates/global_settings 2.prefab","Assets/TerrainComposer/Templates/global_settings.prefab");
    		 }
    		 else {
    		 	FileUtil.CopyFileOrDirectory ("Assets/TerrainComposer/Templates/global_settings 1.prefab","Assets/TerrainComposer/Templates/global_settings.prefab");
    		 }
    		 return;
    	}
    	
    	Global_Settings_Scene = AssetDatabase.LoadAssetAtPath(path,GameObject);
    	if (Global_Settings_Scene) {
    		global_script = Global_Settings_Scene.GetComponent(global_settings_tc);
    		this.Repaint();
    	} 
    	else {
    		 AssetDatabase.Refresh();
    	}
    }
    
    /*
    function save_global_settings() 
	{	
		if (global_script) { 
			var path1: String = "Assets/Terraincomposer/Templates/global_settings.prefab";
			
			Global_Settings_Scene = GameObject.Find("global_settings");
	        
	        if (Global_Settings_Scene) {
	        	global_script = Global_Settings_Scene.GetComponent(global_settings_tc);
	      	
				if (global_script) {
					var prebab: Object;
					AssetDatabase.DeleteAsset(path1);
					var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
					PrefabUtility.ReplacePrefab(Global_Settings_Scene,prefab,ReplacePrefabOptions.ReplaceNameBased);
					PrefabUtility.DisconnectPrefabInstance(Global_Settings_Scene);
					
					AssetDatabase.SaveAssets();
					AssetDatabase.Refresh();
				}
			}
		}
	}
	*/
    
    function add_terrainArea(index: int)
	{
		terrain_region.add_area(index);
		add_terrain(terrain_region.area[index],0,0,terrain_region.area[0]);
		set_auto_search(terrain_region.area[index].auto_search);
		set_auto_search(terrain_region.area[index].auto_name);
	} 
	
	var terrain_size: Vector3;
    var terrain_parent: GameObject;
    
    function create_terrains_area()
    {
    	if (terraincomposer) {EditorWindow.GetWindow(Type.GetType("TerrainComposer"));}
    	
    	Application.runInBackground = true;
    	
    	// current_area.size = global_script.calc_latlong_area_size(current_area.upper_left,current_area.lower_right,current_area.center);
    	
    	create_region = current_region;
    	create_area = current_area;
    	
    	create_area.terrain_done = false;
    	// apply_import_settings = false;
    	terrain_region.area[0].terrains.Clear();
    	
    	terrain_parent = new GameObject();
    	terrain_parent.name = create_region.name;
    	
    	if (terrain_region.area.Count == 0) {
    		add_terrainArea(0);
    	}
    	
    	if (terrain_region.area[0].terrains.Count == 0) {
    		add_terrain(terrain_region.area[0],0,0,terrain_region.area[0]);
		}
		
		terrain_region.area[0].tiles_select.x = create_area.tiles.x;
    	terrain_region.area[0].tiles_select.y = create_area.tiles.y;
    	
    	terrain_region.area[0].tiles_select_total = create_area.tiles.x*create_area.tiles.y;
    	
    	if (terrain_region.area[0].tiles_select_total == 0) {
    		this.ShowNotification(GUIContent("The area is not created. Use the 'Pick' button to create an area"));
    		DestroyImmediate(terrain_parent);
    		return;
    	}
    	
    	if (!Directory.Exists(current_area.export_terrain_path)) {
    		var path: String = current_area.export_terrain_path.Replace(Application.dataPath,"Assets");
    		var index: int = path.LastIndexOf("/");
    		var new_folder: String = path.Substring(index+1);
    		
    		path = path.Replace("/"+new_folder,String.Empty);
    		 
    		AssetDatabase.CreateFolder (path,new_folder);
    	}
    	
    	terrain_region.area[0].auto_name.format = "_x%x_y%y";
    	
    	terrain_size.x = Mathf.Round(create_area.size.x/create_area.tiles.x);
    	terrain_size.y = create_area.terrain_height;
    	terrain_size.z = Mathf.Round(create_area.size.y/create_area.tiles.y);
    	create_terrain_count = 0;
    	create_terrain_loop = true;
    	
    	generate_begin();
    }
    
    function create_terrain(terrainArea1: terrain_area_class,preterrain: terrain_class2,terrain_path: String,terrain_parent: Transform)
	{
		var terrain_index: int;
		var terrain_index_old: int;
		var name_string: String;
		var count_terrain1: int;
		var tiles: tile_class;
		var tile: tile_class;
		var path: String;
		var exists: boolean = false;
		// var delta_tile_x: int = terrainArea.tiles_select.x-terrainArea.tiles.x;
		// var delta_tile_y: int = terrainArea.tiles_select.y-terrainArea.tiles.y;
		var start_number: int = 0;//terrainArea.terrains.Count;
		var length: int = (terrainArea1.tiles_select_total)-start_number;
		// Debug.Log(length);
		// rename_terrains(terrainArea1.tiles_select);
		var terrainData: TerrainData;
		var terrain: Terrain;
		var script_collider: TerrainCollider;
		
		for (count_terrain1 = create_terrain_count;count_terrain1 < length;++count_terrain1)
		{
		    if (terrainArea1.terrains.Count > count_terrain1){
		    	if (terrainArea1.terrains[count_terrain1].terrain){continue;}
		    }
		    
		    var object: GameObject = new GameObject(); 
		    terrain = object.AddComponent(Terrain);
		    script_collider = object.AddComponent(TerrainCollider);
		    
		    terrain_index = count_terrain1+start_number;
		   	// Debug.Log("terrain_index: "+terrain_index);
		   	tiles = calc_terrain_tile(terrain_index,terrainArea1.tiles_select);
		   	// Debug.Log("x"+tiles.x+"_y"+tiles.y);
		    	
		   	name_string = terrainArea1.auto_name.get_name(tiles.x,tiles.y,terrain_index);
		    
		    path = create_area.export_terrain_path;
		    path = "Assets"+path.Replace(Application.dataPath,String.Empty);
		   	path += "/"+create_area.terrain_asset_name+name_string+".asset";
		   	
			if (File.Exists(path)) {
		    	exists = true;
		    	terrain.terrainData = AssetDatabase.LoadAssetAtPath(path,TerrainData) as TerrainData;
		    }
		    else {
		    	terrain.terrainData = new TerrainData();
		    }
		    
		    object.AddComponent(TerrainDetail);
		    // terrain_region.area[0].terrains[count_terrain].terrain.terrainData.heightmapResolution = heightmap_resolution;
			
			terrain.terrainData.heightmapResolution = heightmap_resolution;
			terrain.terrainData.baseMapResolution = preterrain.basemap_resolution;
			terrain.terrainData.alphamapResolution = preterrain.splatmap_resolution;
			terrain.terrainData.SetDetailResolution(preterrain.detail_resolution,preterrain.detail_resolution_per_patch);
			
			terrain.terrainData.size = terrain_size*create_area.terrain_scale;
			
			object.isStatic = true;
		    /*
		    if (create_area.do_heightmap && (!terraincomposer || !create_area.export_to_terraincomposer)) {
		    	#if !UNITY_3_4 && !UNITY_3_5
			    	object.SetActive(false);
				#else
					object.active = false;
			    #endif
		    }
		    */
		    if (terrain_parent){object.transform.parent = terrain_parent;}
			
			// tile = calc_terrain_tile2(terrain_index,terrainArea1.tiles_select);			
			terrain_index_old = calc_terrain_index_old(tiles,terrainArea1.tiles_select);
			terrain.name = create_area.terrain_scene_name+name_string;
		    
		    if (!exists) {
		    	// AssetDatabase.DeleteAsset(path);
				AssetDatabase.CreateAsset(terrain.terrainData,path);
			}
			script_collider.terrainData = terrain.terrainData;
						
			if (terrainArea1.terrains.Count-1 < count_terrain1+start_number)
			{
			 	if (terrainArea1.copy_settings)
			   	{
			   		// Debug.Log("Copy!!!"+terrain_index);
			   		if (terrain_index > 0){add_terrain(terrainArea1,terrainArea1.terrains.Count,terrainArea1.copy_terrain,terrainArea1);} else {add_terrain(terrainArea1,terrainArea1.terrains.Count,-1,terrainArea1);}
			   	}
			   	else
			   	{
			   		global_script.add_terrain(terrainArea1,terrainArea1.terrains.Count,-1,terrainArea1);
			   	}
			} 
			   
			object.transform.position = Vector3(-preterrain.size.x/2,0,-preterrain.size.z/2);
		    terrainArea1.terrains[terrain_index].terrain = terrain;
			
			// set_terrain_splat_textures(terrainArea1.terrains[terrain_index],terrainArea1.terrains[terrain_index]);
			// set_terrain_trees(terrainArea1.terrains[terrain_index]);
			// set_terrain_details(terrainArea1.terrains[terrain_index]);
			    
			// set_detail_script_terrain(terrainArea1.terrains[terrain_index],1);
			set_terrain_parameters(terrainArea1.terrains[terrain_index]);
			// get_terrain_settings(terrainArea1.terrains[terrain_index],"(res)(con)(fir)");
			terrainArea1.terrains[terrain_index].tile_x = tiles.x; 
			terrainArea1.terrains[terrain_index].tile_z = tiles.y;
			// Debug.Log(terrain_index+": "+tiles.x+","+tiles.y);
			terrainArea1.terrains[terrain_index].prearea.max();
			terrainArea1.terrains[terrain_index].foldout = false;
			terrainArea1.terrains[terrain_index].terrain.heightmapPixelError = 1;
			
			fit_terrain_tile(terrain_region.area[0],terrain_region.area[0].terrains[create_terrain_count],true);
			
			if (create_area.do_image) {
    			assign_terrain_splat_alpha(terrainArea1.terrains[terrain_index],true);
				set_terrainArea_splat_textures(terrain_region.area[0],terrain_index);
    		}
    		create_area.terrain_done = true;
    		if (create_area.do_heightmap && (!terraincomposer || !create_area.export_to_terraincomposer)) {
    			heightmap_y = heightmap_resolution-1;
    			generate = true;}
																										
			++create_terrain_count;
			
			return;
		}
		
		terrainArea1.tiles.x = terrainArea1.tiles_select.x;
		terrainArea1.tiles.y = terrainArea1.tiles_select.y;
		terrainArea1.tiles_total = terrainArea1.tiles_select_total;
		terrainArea1.size.x = terrainArea1.terrains[0].size.x*terrainArea1.tiles.x;
		terrainArea1.size.z = terrainArea1.terrains[0].size.x*terrainArea1.tiles.y;
		terrainArea1.size.y = terrainArea1.terrains[0].size.y;
		
		AssetDatabase.Refresh();
		 
		set_terrains_neighbor(terrainArea1);
		set_terrains_neighbor_script(terrainArea1,1);
		
		create_terrain_loop = false;
		
		if (terraincomposer && create_area.export_to_terraincomposer)  { 
    		tc_script.import_terrain_wc(current_area.name);
    	}
    	
		// clear_terrains();
		
		if (!global_script.map.export_heightmap_active && !global_script.map.export_image_active) {Application.runInBackground = false;}
				
		// region.area_size = calc_area_max();
		// set_terrains_neighbor(terrainArea1);
		
		create_splat_count = 0;
		
		if (create_area.do_heightmap && (!create_area.export_to_terraincomposer || !terraincomposer)) {
			heights = new float[0,0];
			generate = false;
			if (raw_file.fs) {raw_file.fs.Close();}
		}
		
		if (create_area.auto_import_settings_apply) {
			start_image_import_settings(create_area);
		}
	}
	
	function start_image_import_settings(area1: map_area_class)
	{		
		area1.maxTextureSize = Mathf.Pow(2,area1.maxTextureSize_select+5);
		create_area = area1;
		terrain_region.area[0].tiles_select.x = create_area.tiles.x;
    	terrain_region.area[0].tiles_select.y = create_area.tiles.y;
    	import_settings_count = 0;
		apply_import_settings = true;
	}
	
	function clear_terrains()
	{
		for (var count_terrain: int = 0;count_terrain < terrain_region.area[0].terrains.Count;++count_terrain) {
			terrain_region.area[0].terrains[count_terrain].terrain = null;
		}
		terrain_region.area[0].terrains.Clear();
	}
	
	function set_terrainArea_splat_textures(terrainArea1: terrain_area_class,count_terrain: int) 
	{
		var path: String;
		var tile: tile_class;
		
		tile = calc_terrain_tile(count_terrain,terrainArea1.tiles_select);	
		
		if (global_script.map.export_jpg) {
			path = create_area.export_image_path.Replace(Application.dataPath,"Assets")+"/"+create_area.export_image_filename+"_x"+tile.x.ToString()+"_y"+tile.y.ToString()+".jpg";
		} 
		else if (global_script.map.export_png) {
			path = create_area.export_image_path.Replace(Application.dataPath,"Assets")+"/"+create_area.export_image_filename+"_x"+tile.x.ToString()+"_y"+tile.y.ToString()+".png";
		}
		if (!File.Exists(path)) {
			this.ShowNotification (GUIContent(path+" doesn't exist! Make sure the image tiles are the same as the exported image tiles"));
			Debug.Log(path+" doesn't exist! Make sure the image tiles are the same as the exported image tiles.");
			return;
		}
		
		
		
		if (!File.Exists(Application.dataPath+"/ReliefPack/Scripts/ReliefTerrain/ReliefTerrain.cs")) {
			terrainArea1.terrains[count_terrain].add_splatprototype(0);
			terrainArea1.terrains[count_terrain].splatPrototypes[0].tileSize = Vector2(terrainArea1.terrains[count_terrain].terrain.terrainData.size.x,terrainArea1.terrains[count_terrain].terrain.terrainData.size.z);
			terrainArea1.terrains[count_terrain].splatPrototypes[0].texture = AssetDatabase.LoadAssetAtPath(path,Texture2D) as Texture2D;
			if (!terrainArea1.terrains[count_terrain].splatPrototypes[0].texture) {Debug.Log(path);}
			set_terrain_splat_textures(terrainArea1.terrains[count_terrain]);
		}
		else {
			terrainArea1.terrains[count_terrain].add_splatprototype(0); 
			terrainArea1.terrains[count_terrain].add_splatprototype(1);
			terrainArea1.terrains[count_terrain].add_splatprototype(2);
			terrainArea1.terrains[count_terrain].add_splatprototype(3);
			
			terrainArea1.terrains[count_terrain].splatPrototypes[0].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Dirt.psd",Texture2D) as Texture2D;
			terrainArea1.terrains[count_terrain].splatPrototypes[1].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Grass.psd",Texture2D) as Texture2D;
			terrainArea1.terrains[count_terrain].splatPrototypes[2].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/GrassRock.psd",Texture2D) as Texture2D;
			terrainArea1.terrains[count_terrain].splatPrototypes[3].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Cliff.psd",Texture2D) as Texture2D;
			
			set_terrain_splat_textures(terrainArea1.terrains[count_terrain]);
			
			// Add RTP if there
			terrainArea1.terrains[count_terrain].rtp_script = terrainArea1.terrains[count_terrain].terrain.gameObject.AddComponent("ReliefTerrain");
			if (terrainArea1.terrains[count_terrain].rtp_script) {
				terrainArea1.terrains[count_terrain].rtp_script.ColorGlobal = AssetDatabase.LoadAssetAtPath(path,Texture2D) as Texture2D;
				
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Bumps[0] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Dirt_NRM.png",Texture2D) as Texture2D;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Bumps[1] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Grass_NRM.png",Texture2D) as Texture2D;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Bumps[2] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/GrassRock_NRM.png",Texture2D) as Texture2D;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Bumps[3] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Cliff_NRM.png",Texture2D) as Texture2D;
				
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Heights[0] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Dirt_DISP.png",Texture2D) as Texture2D;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Heights[1] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Grass_DISP.png",Texture2D) as Texture2D;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Heights[2] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/GrassRock_DISP.png",Texture2D) as Texture2D;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.Heights[3] = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/Cliff_DISP.png",Texture2D) as Texture2D;
				
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.GlobalColorMapBlendValues = Vector3(1,1,1);
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder._GlobalColorMapNearMIP = 1;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.RTP_ReflexLightSpecColor.a = 0;
				
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.ReliefTransform = Vector4((terrain_size.x*create_area.terrain_scale)/22,(terrain_size.z*create_area.terrain_scale)/22,0,0);
				
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.distance_start = 0;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.distance_start_bumpglobal = 0;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.rtp_perlin_start_val = 1;
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.distance_transition_bumpglobal = 300;
				
				create_rtp_combined_textures(terrainArea1.terrains[count_terrain]);
				terrainArea1.terrains[count_terrain].rtp_script.globalSettingsHolder.RefreshAll();
			}
		}
		
		/*
		if (create_area.auto_import_settings_apply) {
			global_script.set_image_import_settings(path,false,create_area.textureFormat,TextureWrapMode.Clamp,create_area.resolution,create_area.mipmapEnabled,create_area.filterMode,create_area.anisoLevel,124);	
		}
		*/
		
		++create_splat_count;
		return;
	}
	
	function set_terrain_splat_textures(preterrain1: terrain_class2)
	{
		if (!preterrain1.terrain){return;}
		
		var splatPrototypes: List.<SplatPrototype> = new List.<SplatPrototype>();
		var count_splat2: int = -1;
		for (var count_splat: int = 0;count_splat < preterrain1.splatPrototypes.Count;++count_splat)
		{
			if (preterrain1.splatPrototypes[count_splat].texture)
			{
				splatPrototypes.Add(new SplatPrototype());
				++count_splat2;
			
				splatPrototypes[count_splat2].texture = preterrain1.splatPrototypes[count_splat].texture;
				splatPrototypes[count_splat2].tileSize = preterrain1.splatPrototypes[count_splat].tileSize;
				splatPrototypes[count_splat2].tileOffset = preterrain1.splatPrototypes[count_splat].tileOffset;
			}
		}
		preterrain1.terrain.terrainData.splatPrototypes = splatPrototypes.ToArray();
	}

	function calc_terrain_tile(terrain_index: int,tiles: tile_class): tile_class
	{
		if (tiles.x == 0 || tiles.y == 0) {
			apply_import_settings = false;
			create_terrain_loop = false;
			this.ShowNotification(GUIContent("The Area is not created. Use the 'Pick' button to create an area"));
			return null;
		}
		
		var tile: tile_class = new tile_class();
		
		tile.y = terrain_index/(tiles.x);
		tile.x = terrain_index-(tile.y*(tiles.x));
		
		// Debug.Log("tile_x: "+tile.x+" tile_y: "+tile.y);
		
		return tile;
	}
	
	function calc_terrain_tile2(terrain_index: int,tiles: tile_class): tile_class
	{
		var tile: tile_class = new tile_class();
		
		tile.y = terrain_index/(tiles.x);
		tile.x = terrain_index-(tile.y*(tiles.x));
		
		// Debug.Log("tile_x: "+tile.x+" tile_y: "+tile.y);
		
		return tile;
	}
	
	function calc_terrain_index_old (tile: tile_class,tiles: tile_class): int
	{
		return ((tile.x*tiles.y)+tile.y);
	}
	
	function assign_terrain_splat_alpha(preterrain1: terrain_class2,update_asset: boolean)
	{
		if (preterrain1.terrain)
		{
			if (!preterrain1.terrain.terrainData){return;}
			if (preterrain1.splatPrototypes.Count < 1){return;}
			
			if (update_asset) {update_terrain_asset(preterrain1);}
			
			var alpha_length: int = Mathf.Ceil(preterrain1.terrain.terrainData.splatPrototypes.Length/4);
			
			var path: String = AssetDatabase.GetAssetPath(preterrain1.terrain.terrainData);
			var path2: String;
			
			/*
			if (preterrain1.splat_alpha) {
				if (preterrain1.splat_alpha.Length > 0) {
			    	path2 = AssetDatabase.GetAssetPath(preterrain1.splat_alpha[0]);
			    
			   		if (path == path2 && preterrain1.splat_alpha.Length == alpha_length) {
			   			return;
			   		}
			    }
			}
		    */
		    		
        	var objects: Object[] = AssetDatabase.LoadAllAssetsAtPath(path);
        	
        	preterrain1.splat_alpha = new Texture2D[objects.Length-1];
		    	
		    for (var count_object: int = 0;count_object < objects.Length;++count_object)
		    {
		    	if (objects[count_object].GetType() == Texture2D)
		    	{
		    		var numbers_only: String = Regex.Replace(objects[count_object].name,"[^0-9]","");
					var index: int;
					index = Convert.ToInt32(numbers_only);
					
					preterrain1.splat_alpha[index] = objects[count_object];
				}
		    }
		}
	}
	
	function process_out(bytes: byte[]): byte[]
	{
		for (var count_byte: int = 0;count_byte < bytes.Length;++count_byte)
		{
			bytes[count_byte] = 255-bytes[count_byte];
		}
		return bytes;
	}
	
	function assign_all_terrain_splat_alpha(terrainArea1: terrain_area_class,update_asset: boolean)
	{
		for (var count_terrain1: int = 0;count_terrain1 < terrainArea1.terrains.Count;++count_terrain1)
		{
			assign_terrain_splat_alpha(terrainArea1.terrains[count_terrain1],update_asset);
		}
	}
	
	function add_terrain(terrainArea1: terrain_area_class,terrain_number: int,copy: int,terrainArea2: terrain_area_class)
	{
		terrainArea1.terrains.Insert(terrain_number,new terrain_class2());
		
		if (copy > -1 && copy < terrainArea2.terrains.Count)
		{
			// terrainArea1.terrains[terrain_number] = copy_terrain(terrainArea2.terrains[copy]);
			terrainArea1.terrains[terrain_number].terrain = null;
		}
		else
		{
			// terrainArea1.terrains[terrain_number].prearea.area.xMax = resolution;
			// terrainArea1.terrains[terrain_number].prearea.area.yMax = resolution;
		}
		terrainArea1.terrains[terrain_number].index = terrain_number;
		// terrain_tiles = terrainArea1.tiles.x+1;
		// calc_terrain_needed_tiles();
		
		// set_smooth_tool_terrain_popup();
		terrainArea1.set_terrain_text(); 
	}
	
	function set_terrain_parameters(preterrain1: terrain_class2)
	{
		preterrain1.terrain.heightmapPixelError = preterrain1.heightmapPixelError;
		preterrain1.terrain.heightmapMaximumLOD = preterrain1.heightmapMaximumLOD;
		preterrain1.terrain.basemapDistance = preterrain1.basemapDistance;
		preterrain1.terrain.castShadows = preterrain1.castShadows;
		preterrain1.terrain.treeDistance = preterrain1.treeDistance;
		preterrain1.terrain.detailObjectDistance = preterrain1.detailObjectDistance;
		preterrain1.terrain.detailObjectDensity = preterrain1.detailObjectDensity;
		preterrain1.terrain.treeBillboardDistance = preterrain1.treeBillboardDistance;
		preterrain1.terrain.treeCrossFadeLength = preterrain1.treeCrossFadeLength;
		preterrain1.terrain.treeMaximumFullLODCount = preterrain1.treeMaximumFullLODCount;
		
		preterrain1.terrain.castShadows = preterrain1.castShadows;
		preterrain1.terrain.terrainData.wavingGrassSpeed = preterrain1.wavingGrassSpeed;
		preterrain1.terrain.terrainData.wavingGrassAmount = preterrain1.wavingGrassAmount;
		preterrain1.terrain.terrainData.wavingGrassStrength = preterrain1.wavingGrassStrength;
		preterrain1.terrain.terrainData.wavingGrassTint = preterrain1.wavingGrassTint;
	}
	
	function set_terrains_neighbor(terrainArea1: terrain_area_class)
	{
		var terrain_number: int;
		
		for (var count_terrain: int = 0;count_terrain < terrainArea1.terrains.Count;++count_terrain)
		{
			if (terrainArea1.terrains[count_terrain].terrain)
			{
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x-1,terrainArea1.terrains[count_terrain].tile_z);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.left = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.left = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x,terrainArea1.terrains[count_terrain].tile_z-1);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.top = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.top = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x+1,terrainArea1.terrains[count_terrain].tile_z);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.right = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.right = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x,terrainArea1.terrains[count_terrain].tile_z+1);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.bottom = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.bottom = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x+1,terrainArea1.terrains[count_terrain].tile_z+1);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.bottom_right = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.bottom_right = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x-1,terrainArea1.terrains[count_terrain].tile_z+1);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.bottom_left = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.bottom_left = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x+1,terrainArea1.terrains[count_terrain].tile_z-1);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.top_right = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.top_right = -1;}
				
				terrain_number = search_tile(terrainArea1,terrainArea1.terrains[count_terrain].tile_x-1,terrainArea1.terrains[count_terrain].tile_z-1);
				if (terrain_number != -1){terrainArea1.terrains[count_terrain].neighbor.top_left = terrain_number;} else {terrainArea1.terrains[count_terrain].neighbor.top_left = -1;}
				
				terrainArea1.terrains[count_terrain].neighbor.self = count_terrain;
				terrainArea1.terrains[count_terrain].index = count_terrain;
			}
		}
	}
	
	function center_terrain_position(terrainArea1: terrain_area_class,preterrain1: terrain_class2)
	{
		if (!preterrain1.terrain){return;}
		if (!preterrain1.terrain.terrainData){return;}
		var new_position: Vector3 = Vector3(-preterrain1.terrain.terrainData.size.x/2,0,-preterrain1.terrain.terrainData.size.z/2)+terrainArea1.center;
		if (preterrain1.terrain.transform.position != new_position)
		{
			preterrain1.terrain.transform.position = new_position;
		}
	}
	
	function calc_terrain_index(tile: tile_class,tiles: tile_class): int
	{
		return (tile.x+(tile.y*(tiles.x-1)));
	}

	function get_terrainArea_center(terrainArea1: terrain_area_class,include_position: boolean): Vector3
	{
		if (!terrainArea1.terrains[0].terrain){return;}
		
		var pos: Vector2;
		var size: Vector2;
		var index: int;
		
		size.x = terrainArea1.tiles_select.x*terrainArea1.terrains[0].terrain.terrainData.size.x;
		size.y = terrainArea1.tiles_select.y*terrainArea1.terrains[0].terrain.terrainData.size.z;
		
		size /= 2;
		pos.x = size.x;
		pos.y = size.y;
		
		if (include_position)
		{
			var leftBottom: int = calc_terrain_index(tile_class(0,terrainArea1.tiles.y),terrainArea1.tiles);
			
			// Debug.Log("left: "+leftBottom);
			
			pos.x = size.x+terrainArea1.terrains[leftBottom].terrain.transform.position.x;
			pos.y = size.y+terrainArea1.terrains[leftBottom].terrain.transform.position.z;
		}
		
		return Vector3(pos.x,terrainArea1.terrains[0].terrain.transform.position.y,pos.y);
	}
	
	function fit_terrain_tiles(terrainArea1: terrain_area_class,preterrain1: terrain_class2,refit: boolean): int
	{
		if (terrainArea1.terrains.Count < 2)
		{
			if (terrainArea1.terrains.Count == 1){center_terrain_position(terrainArea1,terrainArea1.terrains[0]);}
			return 1;
		}
		
		var size: Vector3 = preterrain1.size;
		var pos: Vector3;
		var center: Vector3;
		
		// set_all_terrain_settings(preterrain1,"(siz)");
		
		center = get_terrainArea_center(terrainArea1,false);
		
		for (var count_terrain: int = 0;count_terrain < terrainArea1.terrains.Count;++count_terrain) {
			if (!terrainArea1.terrains[count_terrain].terrain){continue;}
			pos.x = (terrainArea1.terrains[count_terrain].tile_x*terrainArea1.terrains[count_terrain].terrain.terrainData.size.x)+terrainArea1.center.x-center.x;
			pos.y = terrainArea1.center.y;
			pos.z = ((terrainArea1.terrains[count_terrain].tile_z+1)*-terrainArea1.terrains[count_terrain].terrain.terrainData.size.z)+terrainArea1.center.z+center.z;
			
			terrainArea1.terrains[count_terrain].rect = Rect(pos.x,pos.z,terrain_size.x,terrain_size.z);
			
			// Debug.Log(terrainArea1.terrains[count_terrain].rect);
			
			if (refit){terrainArea1.terrains[count_terrain].terrain.transform.position = pos;}//Debug.Log(terrainArea1.terrains[count_terrain].tile_x);}
			// terrainArea1.terrains[count_terrain].color_terrain = Color(0.5,1,0.5);
		} 
		// set_basemap_max();
		set_terrains_neighbor(terrainArea1);
		set_terrains_neighbor_script(terrainArea1,1);
		return 1;
	}
	
	function fit_terrain_tile(terrainArea1: terrain_area_class,preterrain1: terrain_class2,refit: boolean): int
	{
		var size: Vector3 = preterrain1.size;
		var pos: Vector3;
		var center: Vector3;
		
		center = get_terrainArea_center(terrainArea1,false);
		
		pos.x = (preterrain1.tile_x*preterrain1.terrain.terrainData.size.x)+terrainArea1.center.x-center.x;
		pos.y = terrainArea1.center.y;
		pos.z = ((preterrain1.tile_z+1)*-preterrain1.terrain.terrainData.size.z)+terrainArea1.center.z+center.z;
			
		preterrain1.rect = Rect(pos.x,pos.z,terrain_size.x,terrain_size.z);
			
		if (refit){preterrain1.terrain.transform.position = pos;}
		// set_basemap_max();
		
		return 1;
	}
	
	
	function set_terrains_neighbor_script(terrainArea1: terrain_area_class,mode: int)
	{
		var script_neighbor: TerrainNeighbors;
		var terrain_number: int;
		
		for (var count_terrain: int = 0;count_terrain < terrainArea1.terrains.Count;++count_terrain)
		{
			if (terrainArea1.terrains[count_terrain].terrain)
			{
				script_neighbor = terrainArea1.terrains[count_terrain].terrain.GetComponent(TerrainNeighbors);
					
				if (mode == 1)
				{
					if (!script_neighbor){script_neighbor = terrainArea1.terrains[count_terrain].terrain.gameObject.AddComponent(TerrainNeighbors);}
					
					terrain_number = terrainArea1.terrains[count_terrain].neighbor.left;
					if (terrain_number != -1){script_neighbor.left = terrainArea1.terrains[terrain_number].terrain;} else {script_neighbor.left = null;}
					
					terrain_number = terrainArea1.terrains[count_terrain].neighbor.top;
					if (terrain_number != -1){script_neighbor.top = terrainArea1.terrains[terrain_number].terrain;} else {script_neighbor.top = null;}
					
					terrain_number = terrainArea1.terrains[count_terrain].neighbor.right;
					if (terrain_number != -1){script_neighbor.right = terrainArea1.terrains[terrain_number].terrain;} else {script_neighbor.right = null;}
					
					terrain_number = terrainArea1.terrains[count_terrain].neighbor.bottom;
					if (terrain_number != -1){script_neighbor.bottom = terrainArea1.terrains[terrain_number].terrain;} else {script_neighbor.bottom = null;}
				}
				if (mode == -1)
				{
					if (script_neighbor)
					{
						DestroyImmediate(script_neighbor);
					}
				}
			}
		}
	}

	function search_tile(terrainArea1: terrain_area_class,tile_x: int,tile_z: int): int
	{
		if (tile_x > terrainArea1.tiles_select.x-1 || tile_x < 0){return -1;}
		if (tile_z > terrainArea1.tiles_select.y-1 || tile_z < 0){return -1;}
		
		for (var count_terrain: int = 0;count_terrain < terrainArea1.terrains.Count;++count_terrain)
		{
			if (terrainArea1.terrains[count_terrain].tile_x == tile_x && terrainArea1.terrains[count_terrain].tile_z == tile_z){return count_terrain;}
		}
		return -1;
	}	
	
	function update_terrain_asset(preterrain: terrain_class2)
	{
		if (preterrain.terrain)
		{
			var path: String = AssetDatabase.GetAssetPath(preterrain.terrain.terrainData);
			
			AssetDatabase.ImportAsset(path);
        }
	}
	
	function set_auto_search(auto_search: auto_search_class)
	{
		var index: int = auto_search.select_index;
		
		if (!global_script){load_global_settings();}
		
		auto_search.format = global_script.auto_search_list[index].format;
		auto_search.digits = global_script.auto_search_list[index].digits;
		auto_search.start_x = global_script.auto_search_list[index].start_x;
		auto_search.start_y = global_script.auto_search_list[index].start_y;
		auto_search.start_n = global_script.auto_search_list[index].start_n;
		auto_search.output_format = global_script.auto_search_list[index].output_format;
	}
	
	function set_terrains_heightmap_resolution()
	{
		for (var count_terrain: int = 0;count_terrain < terrain_region.area[0].terrains.Count;++count_terrain) {
			
		}
	}
	
	var frames: float;
	var auto_speed_time: float;
	var generate: boolean = false;
	var generate_speed: int = 10000;
	var generate_time_start: float;
	var heights: float[,];
	var heightmap_x: float;
	var heightmap_y: float;
	var heightmap_res_x: float;
	var heightmap_res_y: float;
	var heightmap_resolution: int;
	var heightmap_break_x_value: int;
	var heightmap_count_terrain: int;
	var target_frame: float = 30;
	var h_local_x: int;
	var h_local_y: int;
		
	var raw_file: raw_file_class = new raw_file_class();
	var conversion_step: Vector2;
	
	var create_terrain_loop: boolean = false;
	var apply_import_settings: boolean = false;
	var import_settings_count: int;
	var create_terrain_count: int;
	var create_splat_count: int;
	
	function generate_begin()
	{
		heightmap_resolution = create_area.terrain_heightmap_resolution;
		
		if (heightmap_resolution < 33) {heightmap_resolution = 33;}
		else if (heightmap_resolution > 33 && heightmap_resolution < 65) {heightmap_resolution = 65;}
		else if (heightmap_resolution > 65 && heightmap_resolution < 129) {heightmap_resolution = 129;}
		else if (heightmap_resolution > 129 && heightmap_resolution < 257) {heightmap_resolution = 257;}
		else if (heightmap_resolution > 257 && heightmap_resolution < 513) {heightmap_resolution = 513;}
		else if (heightmap_resolution > 513 && heightmap_resolution < 1025) {heightmap_resolution = 1025;}
		else if (heightmap_resolution > 1025 && heightmap_resolution < 2049) {heightmap_resolution = 2049;}
		else if (heightmap_resolution > 2049) {heightmap_resolution = 4097;}
	 				
	 	// set_terrains_heightmap_resolution();
	 	if (create_area.do_heightmap && (!terraincomposer || !create_area.export_to_terraincomposer) || generate_manual) {
	 		heights = new float[heightmap_resolution,heightmap_resolution];
			if (!create_area.import_heightmap) {
				raw_file.file = create_area.export_heightmap_path+"/"+create_area.export_heightmap_filename+".raw";
			}
			else {
				raw_file.file = create_area.converter_destination_path_full;
			}
			
			if (!load_raw_file()) {
				create_terrain_loop = false;
				if (!global_script.map.export_heightmap_active && !global_script.map.export_image_active) {Application.runInBackground = false;}
				this.ShowNotification(GUIContent("Heightmap File: "+raw_file.file+" does not exist."));
			}
			
			set_raw_auto_scale();
					
			heightmap_count_terrain = 0;
			heightmap_break_x_value = 0;
		}
		
		// Debug.Log("heightmap_resolution: "+heightmap_resolution);
	}
	
	function generate_heightmap2()
	{
		frames = 1/(Time.realtimeSinceStartup-auto_speed_time);
	 	auto_speed_time = Time.realtimeSinceStartup; 
	 	 
		row_object_count = 0;   		
	   	break_x = false; 
	   	
	   	if (terrain_region.area[0].terrains.Count == 0) {
	   		generate = false;
	   		create_area.terrain_done = false;
	   		this.Repaint();
	   		return;
	   	}
	   	
	   	if (!terrain_region.area[0].terrains[heightmap_count_terrain].terrain) {
	   		this.ShowNotification(GUIContent("Terrains are not complete anymore, please recreate the terrains"));
	   		generate = false;
	   		create_area.terrain_done = false;
	   		this.Repaint();
	   		return;
	   	}
	   	 
	   	for(heightmap_res_y = heightmap_y;heightmap_res_y >= (heightmap_res_y-generate_speed);--heightmap_res_y)
		{
	 		if (heightmap_res_y < 0)
		 	{
	 			if (generate)
		 		{
		 			terrain_apply(terrain_region.area[0].terrains[heightmap_count_terrain]);
 					for (var y7: int = 0;y7 < heightmap_resolution;++y7) {	
	 					for (var x7: int = 0;x7 < heightmap_resolution;++x7) {
	 						heights[y7,x7] = 0;
	 					}
	 				}
	 				generate = false;	
			    	/*
			    	#if !UNITY_3_4 && !UNITY_3_5
				    terrain_region.area[0].terrains[heightmap_count_terrain].terrain.gameObject.SetActive(true);	
					#else
					terrain_region.area[0].terrains[heightmap_count_terrain].terrain.gameObject.active = true;	
				    #endif
				    */
		 		}
	 	 		if (!generate)
		 		{ 
		 			++heightmap_count_terrain;
		 			if (generate_manual) {
		 				if (heightmap_count_terrain < terrain_region.area[0].terrains.Count) {
		 					generate = true;
		 					heightmap_res_y = heightmap_resolution-1;
	   						heightmap_y = heightmap_resolution-1;
	   						heightmap_break_x_value = 0;	
		 					this.Repaint();
		 					return 2;
		 				}
		 				else {
		 					generate_manual = false;
		 					raw_file.fs.Close();
							raw_file.loaded = false;
		 					this.Repaint();
		 					return 2;
		 				}
		 			}
		 			else {
		 				return 2;
		 			}
		 		}
		 			
	   			// Debug.Log("layer: "+heightmap_count_layer+" filter:"+heightmap_count_filter);
	   			heightmap_res_y = heightmap_resolution-1;
	   			heightmap_y = heightmap_resolution-1;
	   			heightmap_break_x_value = 0;	
	   			// heightmap_counter_y = heightmap_y;
		 	}
	 		
	 		for (heightmap_res_x = heightmap_break_x_value;heightmap_res_x < heightmap_resolution;++heightmap_res_x)
	 		{
	 			// height = heights[heightmap_y,heightmap_x];
				// degree = (calc_terrain_angle_from_heights(preterrain,local_x_rot,local_y_rot,settings.smooth_angle)*settings.global_degree_strength)+settings.global_degree_level;
		 		 								
				heights[heightmap_res_y,heightmap_res_x] = create_area.terrain_curve.Evaluate(calc_raw_value(Vector2(heightmap_res_x,heightmap_res_y),create_area.heightmap_offset));
				/*
				if (Time.realtimeSinceStartup-auto_speed_time > (1.0/target_frame))
				{
					heightmap_break_x_value = heightmap_res_x+1;
						
					row_object_count = 0;
					break_x = true;
					heightmap_y = heightmap_res_y;
					generate_time = Time.realtimeSinceStartup - generate_time_start;
					// Debug.Log("break");
					return 4;
				}
				*/
			} 
			heightmap_break_x_value = 0;	
		}
		
		heightmap_y -= (generate_speed+1);
		
		generate_time = Time.realtimeSinceStartup - generate_time_start;
	   
		return 1;
	}
	
	function terrain_apply(preterrain1: terrain_class2)
	{ 
		preterrain1.terrain.terrainData.SetHeights(0,0,heights);
		// if (smooth_command){smooth_terrain(preterrain1,smooth_tool_layer_strength);}
	}
	
	function set_raw_auto_scale()
	{
		conversion_step.x = ((heightmap_resolution-1)*terrain_region.area[0].tiles_select.x)/(raw_file.resolution.x-1);
		conversion_step.y = ((heightmap_resolution-1)*terrain_region.area[0].tiles_select.y)/(raw_file.resolution.y-1);
		
		// Debug.Log(conversion_step.x+","+conversion_step.y);
		// Debug.Log(heightmap_resolution);
	}
	
	var x_old: int;
	
	function calc_raw_value(pos: Vector2,offset: Vector2): float
	{
		var width: float = 0;
		var height: float = raw_file.resolution.y-1;
		
		var tile_x: float;
		var tile_y: float; 
		tile_x = terrain_region.area[0].terrains[heightmap_count_terrain].tile_x*(heightmap_resolution-1);
		// tile_y = ((raw_file.resolution.y-1)/terrain_region.area[0].tiles_select.y)*terrain_region.area[0].terrains[heightmap_count_terrain].tile_z;
		tile_y = (terrain_region.area[0].tiles_select.y-terrain_region.area[0].terrains[heightmap_count_terrain].tile_z-1)*(heightmap_resolution-1); 
		// Debug.Log("pos.x: "+pos.x+" pos.y: "+pos.y);
		
		// conversion_step = Vector2(1,1);
		
		pos.x = ((pos.x+tile_x)/conversion_step.x)+width;
		pos.y = (((pos.y+tile_y)/conversion_step.y)*-1)+height;
		
		// Debug.Log("pos2.x: "+pos2.x+" pos2.y: "+pos2.y+" pos.x: "+pos.x+" pos.y: "+pos.y);
		
		h_local_x = pos.x;
		h_local_y = pos.y; 
		
		if (h_local_x > raw_file.resolution.x-1 || h_local_x < 0){return 0;}
		if (h_local_y > raw_file.resolution.y-1 || h_local_y < 0){return 0;}
		
		var index1: ulong = (h_local_y*(raw_file.resolution.x*2))+(h_local_x*2);
		
		raw_file.fs.Position = index1;
					
		var byte1: byte = raw_file.fs.ReadByte();
		var byte2: byte = raw_file.fs.ReadByte();
		
		 return (((byte1*raw_file.product1)+(byte2*raw_file.product2))/65535.0);
	}
	
	function load_raw_file(): boolean
	{
		if (!File.Exists(raw_file.file)) {return false;}
		
		raw_file.fs = new FileStream(raw_file.file,FileMode.Open);
		if (!create_region.area[create_region.area_select].import_heightmap) {
			raw_file.resolution.x = create_region.area[create_region.area_select].heightmap_resolution.x;
			raw_file.resolution.y = create_region.area[create_region.area_select].heightmap_resolution.y;
		}
		else {
			raw_file.resolution.x = create_region.area[create_region.area_select].converter_resolution.x;
			raw_file.resolution.y = create_region.area[create_region.area_select].converter_resolution.y;
		}
		// raw_file.bytes = File.ReadAllBytes(raw_file.file);
		// Debug.Log("raw: "+raw_file.bytes.Length);
		
		if (raw_file.mode == raw_mode_enum.Mac) {
			raw_file.product1 = 256.0;
    		raw_file.product2 = 1.0;
    	} 
    	else {
    		raw_file.product1 = 1.0;
    		raw_file.product2 = 256.0;
    	}
    	
		raw_file.loaded = true;
		return true;
	}
	
	function add_area(region1: map_region_class,index: int,name: String)
	{
		region1.area.Add(new map_area_class(name,index));
		index = region1.area.Count-1;
						
		area1 = region1.area[index];
		area1.center = global_script.map_latlong_center;
		region1.area_select = region1.area.Count-1;
		region1.make_area_popup();
		
		area1.export_heightmap_path = Application.dataPath;
		area1.export_image_path = area1.export_heightmap_path;
		area1.export_terrain_path = area1.export_heightmap_path+"/Terrains";
		area1.export_heightmap_filename = area1.name;
		area1.export_image_filename = area1.name;
		area1.terrain_asset_name = "_"+area1.name;
		area1.terrain_scene_name = area1.name;
	}
	
	function set_terrain_default(area1: map_area_class) 
	{
		// export_heightmap_path = 
		// export_heightmap_filename = 
		
		// export_image_path =
		// export_image_filename =
		area1.export_image_import_settings = true;
		
		area1.export_terrain_path = area1.export_heightmap_path+"/Terrains";
		area1.export_to_terraincomposer = true;
		
		area1.terrain_asset_name = "_"+area1.name;
		area1.terrain_scene_name = area1.name;
		 
		area1.terrain_height = 5000;
		area1.do_heightmap = true;
		area1.do_image = true;
		area1.mipmapEnabled = true;
		area1.filterMode = FilterMode.Trilinear;
		area1.anisoLevel = 9; 
		area1.maxTextureSize_select = 6;
		area1.auto_import_settings_apply = true;
		area1.textureFormat = TextureImporterFormat.AutomaticCompressed;
	}
	
	function init_paths()
	{
		if (!global_script) {return;}
		
		var area1: map_area_class = global_script.map.region[global_script.map.region_select].area[global_script.map.region[global_script.map.region_select].area_select];
		
		if (area1.export_heightmap_path.Length == 0) {area1.export_heightmap_path = Application.dataPath;}
		if (area1.export_image_path.Length == 0) {area1.export_image_path = Application.dataPath;}
		if (area1.export_terrain_path.Length == 0) {area1.export_terrain_path = Application.dataPath+"/Terrains";}
		if (area1.preimage_path) {
			if (area1.preimage_path.Length == 0) {
				if (!area1.preimage_path_changed) {
					area1.preimage_path = area1.export_image_path;
				}
				else {
					area1.preimage_path = Application.dataPath;
				}
			}
		}
		else {
			area1.preimage_path = Application.dataPath;
		}
	} 
	
	function copy_texture_to_buffer(buffer: buffer_class,texture: Texture2D,x: int,y: int,width: int,height: int) 
	{
		pixels = texture.GetPixels(x,y,width,height);
		
		if (buffer.bytes) {
			if (buffer.bytes.Length != pixels.Length*3) {buffer.bytes = new byte[pixels.Length*3];}
		}
		else {
			buffer.bytes = new byte[pixels.Length*3];
		}	
		
		for (var count_pixel: int = 0;count_pixel < pixels.Length;++count_pixel) {
			buffer.bytes[count_pixel*3] = pixels[count_pixel][0]*255;
			buffer.bytes[(count_pixel*3)+1] = pixels[count_pixel][1]*255;
			buffer.bytes[(count_pixel*3)+2] = pixels[count_pixel][2]*255;
		}
	}
	
	function copy_buffer_to_texture(buffer: buffer_class) 
	{
		if (!pixels) {
			pixels = new Color[buffer.bytes.Length/3];
		}
		else if (pixels.Length != buffer.bytes.Length/3) {pixels = new Color[buffer.bytes.Length/3];}
		
		for (var count_pixel: int = 0;count_pixel < pixels.Length;++count_pixel) {
			pixels[count_pixel][0] = (buffer.bytes[count_pixel*3]*1.0)/255;
			pixels[count_pixel][1] = (buffer.bytes[(count_pixel*3)+1]*1.0)/255; 
			pixels[count_pixel][2] = (buffer.bytes[(count_pixel*3)+2]*1.0)/255;
		}
	}
	
	function image_map2()
	{
		if (!global_script.map2) {
			global_script.map2 = new Texture2D(800,800);
		}
		
		pixels = global_script.map2.GetPixels(0,32,800,768);
		global_script.map0.SetPixels(800,0,800,768,pixels);
							
		global_script.map0.Apply();
	}
	
	function image_generate_begin()
	{
		if (global_script.map.preimage_edit.generate && global_script.map.preimage_edit.mode == 2) {return;}
		// if (global_script.map.preimage_loop) {return;}
		
		if (!global_script.map.preimage_edit.generate) {
			global_script.map.preimage_edit.y1 = 0;
			global_script.map.preimage_edit.mode = 1;
			global_script.map.preimage_edit.generate = true;
			global_script.map.preimage_edit.repeat = 0;
			var radius: int = global_script.map.preimage_edit.radiusSelect;
			if (radius > 740) {radius = 740;}
			global_script.map.preimage_edit.radius = radius;
			global_script.map.preimage_edit.first = true;
			
			global_script.map.preimage_edit.resolution = Vector2(800,768);			
					
			global_script.map.preimage_edit.inputBuffer.resolution = Vector2(800,768);
			//global_script.map.preimage_edit.inputBuffer.resolution = Vector2(8192,8192);
			global_script.map.preimage_edit.inputBuffer.size = Vector2(800,768);
			global_script.map.preimage_edit.inputBuffer.radius = -20;
			
			global_script.map.preimage_edit.inputBuffer.init(); 
			global_script.map.preimage_edit.tile.x = 0;
			global_script.map.preimage_edit.tile.y = 0;
			global_script.map.preimage_edit.inputBuffer.getRects(global_script.map.preimage_edit.tile);
			
			if (global_script.map.preimage_edit.inputBuffer.file) {global_script.map.preimage_edit.inputBuffer.file.Close();}
			
			// global_script.map.preimage_edit.outputBuffer.resolution = Vector2(current_area.resolution*current_area.tiles.x,current_area.resolution*current_area.tiles.y);
			global_script.map.preimage_edit.outputBuffer.resolution = global_script.map.preimage_edit.inputBuffer.resolution;
			global_script.map.preimage_edit.outputBuffer.size = global_script.map.preimage_edit.inputBuffer.size;
			global_script.map.preimage_edit.outputBuffer.radius = global_script.map.preimage_edit.inputBuffer.radius;
			
			global_script.map.preimage_edit.outputBuffer.init();
			global_script.map.preimage_edit.tile.x = 0;
			global_script.map.preimage_edit.tile.y = 0;
			global_script.map.preimage_edit.outputBuffer.getRects(global_script.map.preimage_edit.tile);
			
			copy_texture_to_buffer(global_script.map.preimage_edit.inputBuffer,global_script.map1,0,32,800,768);
			global_script.map.preimage_edit.outputBuffer.clear_bytes();
			// global_script.map.preimage_edit.border = true;
		}
		else {
			global_script.map.preimage_edit.generate_call = true;
		}
	}
	
	function image_edit_apply()
	{
		if (!global_script.map0){global_script.map0 = new Texture2D(1600,768);}
		
		// global_script.map.preimage_edit.convert_texture(global_script.map1,global_script.map2,800,800,true);
		global_script.map.preimage_edit.convert_texture_raw(true);
		
		if (!global_script.map.preimage_edit.generate) {		
					
			// pixels = global_script.map2.GetPixels(0,32,800,768);
			copy_buffer_to_texture(global_script.map.preimage_edit.outputBuffer);
			global_script.map0.SetPixels(800,0,800,768,pixels);
			
			global_script.map0.Apply(); 
			
			if (global_script.map.preimage_edit.generate_call) {
				global_script.map.preimage_edit.regen = false;
				global_script.map.preimage_edit.border = false;
				image_generate_begin();
				global_script.map.preimage_edit.generate_call = false;
			}
			else if (global_script.map.preimage_edit.regen) {
				global_script.map.preimage_edit.inputBuffer.copy_bytes(global_script.map.preimage_edit.outputBuffer.bytes,global_script.map.preimage_edit.inputBuffer.bytes);
				global_script.map.preimage_edit.y1 = 0;
				global_script.map.preimage_edit.generate = true;
				global_script.map.preimage_edit.first = false;
				global_script.map.preimage_edit.regen = false;
				global_script.map.preimage_edit.radius -= 25;
				++global_script.map.preimage_edit.repeat;
			}
		}
		
		this.Repaint();
	}
	
	function convert_textures_begin(area1: map_area_class): boolean
	{
		/*
		if (global_script.map.export_raw && !global_script.map.export_jpg && !global_script.map.export_png) {
			this.ShowNotification (GUIContent("Image Editor can only post process Jpg and Png at the moment, activate 'Export Active' and reexport the images to apply the Image Editor to them"));
			return false;
		}
		*/
		// load_convert_texture(area1);
		// global_script.map.preimage_edit.inputRaw = new FileStream(current_area.export_image_path+"/"+current_area.export_image_filename+"_combined.raw",FileMode.Open);
		
		var path1: String = current_area.export_image_path+"/"+current_area.export_image_filename+"_combined.raw";
		
		if (!File.Exists(path1)) {
			this.ShowNotification (GUIContent(path1+" doesn't exist! Export images as Raw in 'Image Export', after that use the 'Combine' button to combine them."));
			Debug.Log(path1+" doesn't exist! Export images as Raw in 'Image Export', after that use the 'Combine' button to combine them.");
			return;
		}
		
		global_script.map.preimage_edit.time_start = Time.realtimeSinceStartup;
		
		var path2: String;
		
		if (!global_script.map.preimage_edit.save_new) {
		  path2 = current_area.export_image_path+"/"+current_area.export_image_filename+"_combined2.raw";
		}
		else {
			path2 = current_area.preimage_path+"/"+current_area.preimage_filename+"_combined2.raw";
		}
		
		global_script.map.preimage_edit.first = true;
		global_script.map.preimage_edit.resolution = Vector2(2048,2048);			
					
		//global_script.map.preimage_edit.outputRaw = new FileStream(current_area.export_image_path+"/"+current_area.export_image_filename+"_combined2.raw",FileMode.Create);
		
		global_script.map.preimage_edit.radius = global_script.map.preimage_edit.radiusSelect;
		
		global_script.map.preimage_edit.inputBuffer.resolution = Vector2(current_area.resolution*current_area.tiles.x,current_area.resolution*current_area.tiles.y);
		//global_script.map.preimage_edit.inputBuffer.resolution = Vector2(8192,8192);
		global_script.map.preimage_edit.inputBuffer.size = Vector2(2048,2048);
		global_script.map.preimage_edit.inputBuffer.radius = global_script.map.preimage_edit.radius;
		
		global_script.map.preimage_edit.inputBuffer.init(); 
		global_script.map.preimage_edit.tile.x = 0;
		global_script.map.preimage_edit.tile.y = 0;
		global_script.map.preimage_edit.inputBuffer.getRects(global_script.map.preimage_edit.tile);
		
		if (global_script.map.preimage_edit.inputBuffer.file) {global_script.map.preimage_edit.inputBuffer.file.Close();}
		global_script.map.preimage_edit.inputBuffer.file = new FileStream(path1,FileMode.Open);
		global_script.map.preimage_edit.inputBuffer.read(); 
		
		// global_script.map.preimage_edit.outputBuffer.resolution = Vector2(current_area.resolution*current_area.tiles.x,current_area.resolution*current_area.tiles.y);
		
		global_script.map.preimage_edit.outputBuffer.resolution = global_script.map.preimage_edit.inputBuffer.resolution;
		global_script.map.preimage_edit.outputBuffer.size = global_script.map.preimage_edit.inputBuffer.size;
		global_script.map.preimage_edit.outputBuffer.radius = global_script.map.preimage_edit.radius;
		
		global_script.map.preimage_edit.outputBuffer.init();
		global_script.map.preimage_edit.tile.x = 0;
		global_script.map.preimage_edit.tile.y = 0;
		global_script.map.preimage_edit.outputBuffer.getRects(global_script.map.preimage_edit.tile);
		global_script.map.preimage_edit.outputBuffer.clear_bytes();
		if (global_script.map.preimage_edit.outputBuffer.file) {global_script.map.preimage_edit.outputBuffer.file.Close();}
		global_script.map.preimage_edit.outputBuffer.file = new FileStream(path2,FileMode.Create);
		
		// global_script.map.preimage_edit.outputBuffer.copy_bytes(global_script.map.preimage_edit.inputBuffer.bytes,global_script.map.preimage_edit.outputBuffer.bytes);
		// global_script.map.preimage_edit.outputBuffer.write();
		
		// if (global_script.map.preimage_edit.inputBuffer.file) {global_script.map.preimage_edit.inputBuffer.file.Close();}
		// if (global_script.map.preimage_edit.outputBuffer.file) {global_script.map.preimage_edit.outputBuffer.file.Close();}
		//}
		//else {
			//global_script.map.preimage_edit.outputRaw = new FileStream(current_area.export_image_path+"/"+current_area.export_image_filename+"_combined2.raw",FileMode.Open);
		//}
		global_script.map.preimage_edit.generate = true;
		global_script.map.preimage_edit.y1 = 0;
		global_script.map.preimage_edit.repeat = 0;
		global_script.map.preimage_edit.mode = 2;
		return true;
	}
	
	function convert_textures_raw(area1: map_area_class)
	{
		global_script.map.preimage_edit.convert_texture_raw(true);
		
		if (!global_script.map.preimage_edit.generate) {	
			
				global_script.map.preimage_edit.outputBuffer.write();
				
				++global_script.map.preimage_edit.tile.x;
				if (global_script.map.preimage_edit.tile.x > global_script.map.preimage_edit.inputBuffer.tiles.x-1) { 
					global_script.map.preimage_edit.tile.x = 0;
					++global_script.map.preimage_edit.tile.y;
					
					if (global_script.map.preimage_edit.tile.y > global_script.map.preimage_edit.inputBuffer.tiles.y-1) {
						if (global_script.map.preimage_edit.regen) {// && global_script.map.preimage_edit.tile.x == -1) {
							global_script.map.preimage_edit.inputBuffer.file = global_script.map.preimage_edit.outputBuffer.file;
							global_script.map.preimage_edit.tile.x = 0;
							global_script.map.preimage_edit.tile.y = 0;
							global_script.map.preimage_edit.first = false; 
							global_script.map.preimage_edit.regen = false;
							global_script.map.preimage_edit.radius -= 25;
							++global_script.map.preimage_edit.repeat;
							// Debug.Log(global_script.map.preimage_edit.repeat);
						}
						else {
							if (global_script.map.preimage_edit.inputBuffer.file) {global_script.map.preimage_edit.inputBuffer.file.Close();}
							if (global_script.map.preimage_edit.outputBuffer.file) {global_script.map.preimage_edit.outputBuffer.file.Close();}	
							return;
						}
					}
				}
				
				// Debug.Log("tile x:"+global_script.map.preimage_edit.tile.x+" y:"+global_script.map.preimage_edit.tile.y);
				
				// Debug.Log("tile x: "+global_script.map.preimage_edit.tile.x+" y: "+global_script.map.preimage_edit.tile.y);
				global_script.map.preimage_edit.inputBuffer.getRects(global_script.map.preimage_edit.tile);
				global_script.map.preimage_edit.outputBuffer.getRects(global_script.map.preimage_edit.tile);
				global_script.map.preimage_edit.outputBuffer.clear_bytes();
				global_script.map.preimage_edit.inputBuffer.read();
				global_script.map.preimage_edit.generate = true;
				global_script.map.preimage_edit.y1 = global_script.map.preimage_edit.inputBuffer.offset.y;
			    
			}
			
			/*
			if (global_script.map.preimage_edit.regen) {// && global_script.map.preimage_edit.radius > 200) {
					global_script.map.preimage_edit.tile.x = 0;
					global_script.map.preimage_edit.tile.y = 0;
					global_script.map.preimage_edit.regen = false;
					global_script.map.preimage_edit.radius -= 10;
					
					global_script.map.preimage_edit.outputBuffer.write();
					
					if (global_script.map.preimage_edit.first) {
						// global_script.map.preimage_edit.inputBuffer.file.Close();
						// global_script.map.preimage_edit.inputBuffer.file = global_script.map.preimage_edit.outputBuffer.file;
					}
					
					global_script.map.preimage_edit.inputBuffer.copy_bytes(global_script.map.preimage_edit.outputBuffer.bytes,global_script.map.preimage_edit.inputBuffer.bytes);
					
					global_script.map.preimage_edit.first = false; 
					global_script.map.preimage_edit.generate = true;
					global_script.map.preimage_edit.y1 = global_script.map.preimage_edit.inputBuffer.offset.y;
			
				}
			*/
			/*
			save_convert_texture(area1);
			++area1.preimage_count;
			var tiles_total: int = area1.tiles.x*area1.tiles.y;
			if (area1.preimage_count > tiles_total-1) {
				global_script.map.preimage_edit.loop = false;
				AssetDatabase.Refresh();
			}
			else {
				convert_textures_begin(area1);
			}
			*/
		this.Repaint();
	}
	
	function load_convert_texture(area1: map_area_class)
	{
		convert_tile.y = area1.preimage_count/(area1.tiles.x);
		convert_tile.x = area1.preimage_count-(convert_tile.y*(area1.tiles.x));
		
		var filename: String = area1.export_image_filename+"_x"+convert_tile.x+"_y"+convert_tile.y;
		var path: String = area1.export_image_path+"/";
				
		if (global_script.map.export_jpg)
		{
			if (File.Exists(path+filename+".jpg")) { 
				// AssetDatabase.Refresh();
				// AssetDatabase.ImportAsset(area1.export_image_path+"/"+filename+".jpg");
			
				// Debug.Log(path.Replace(Application.dataPath,"Assets")+filename+".jpg");
				global_script.set_image_import_settings(path.Replace(Application.dataPath,"Assets")+filename+".jpg",true,TextureImporterFormat.RGB24,TextureWrapMode.Clamp,convert_area.resolution,convert_area.mipmapEnabled,convert_area.filterMode,convert_area.anisoLevel,3);
				// AssetDatabase.Refresh(); 
				convert_texture = AssetDatabase.LoadAssetAtPath(path.Replace(Application.dataPath,"Assets")+filename+".jpg",Texture2D) as Texture2D;
			}
			else {
				this.ShowNotification (GUIContent(path+filename+".jpg doesn't exist! Make sure the image tiles are the same as the exported image tiles"));
				Debug.Log(path+filename+".jpg doesn't exist! Make sure the image tiles are the same as the exported image tiles.");
			}
		}
		
		else if (global_script.map.export_png){
			if (File.Exists(path+filename+".png")) 
			{
				// AssetDatabase.Refresh();
				// AssetDatabase.ImportAsset(area1.export_image_path+"/"+filename+".png");
				// convert_texture = AssetDatabase.LoadAssetAtPath(path+filename+".png",Texture2D) as Texture2D;
				global_script.set_image_import_settings(path.Replace(Application.dataPath,"Assets")+filename+".png",true,TextureImporterFormat.RGB24,TextureWrapMode.Clamp,convert_area.resolution,convert_area.mipmapEnabled,convert_area.filterMode,convert_area.anisoLevel,3);
				// Debug.Log(path.Replace(Application.dataPath,"Assets")+filename+".png");
				// AssetDatabase.Refresh(); 
				convert_texture = AssetDatabase.LoadAssetAtPath(path.Replace(Application.dataPath,"Assets")+filename+".png",Texture2D) as Texture2D;
				
				/*
				if (area1.export_image_import_settings) {
					import_png_path = area1.export_image_path+"/"+filename+".png";
					import_image_area = convert_area;
					import_settings_call = true;
					import_png_call = true;
				}
				*/
			}
			else {
				this.ShowNotification (GUIContent(path+filename+".png doesn't exist! Make sure the image tiles are the same as the exported image tiles"));
				Debug.Log(path+filename+".png doesn't exist! Make sure the image tiles are the same as the exported image tiles.");
			}
		}
	}
	
	function save_convert_texture(area1: map_area_class)
	{
		var filename: String;
		var path: String;
		var filename2: String;
		var path2: String;
		
		if (area1.preimage_save_new) {
			filename2 = area1.preimage_filename+"_x"+convert_tile.x+"_y"+convert_tile.y;
			path2 = area1.preimage_path;
		}
		else {
			filename2 = area1.export_image_filename+"_x"+convert_tile.x+"_y"+convert_tile.y;
			path2 = area1.export_image_path;
		}
		
		if (global_script.map.export_jpg) {
			export_texture_as_jpg(path2+"/"+filename2+".jpg",convert_texture,global_script.map.export_jpg_quality);
			
			filename = area1.export_image_filename+"_x"+convert_tile.x+"_y"+convert_tile.y;
			path = area1.export_image_path;
			
			// global_script.set_image_import_settings(path2.Replace(Application.dataPath,"Assets")+"/"+filename2+".jpg",false,area1.textureFormat,TextureWrapMode.Clamp,area1.resolution,area1.mipmapEnabled,area1.filterMode,area1.anisoLevel,127);						
			global_script.set_image_import_settings(path.Replace(Application.dataPath,"Assets")+"/"+filename+".jpg",false,area1.textureFormat,TextureWrapMode.Clamp,area1.resolution,area1.mipmapEnabled,area1.filterMode,area1.anisoLevel,127);						
			if (global_script.map.preimage_edit.import_settings) {
				import_image_area = area1;
				import_jpg_path = path2.Replace(Application.dataPath,"Assets")+"/"+filename2+".jpg";
				import_settings_call = true;
				import_jpg_call = true;
			}
		}			
		if (global_script.map.export_png) {
			export_texture_to_file(path2,filename2,convert_texture); 
			
			filename = area1.export_image_filename+"_x"+convert_tile.x+"_y"+convert_tile.y;
			path = area1.export_image_path;
			
			global_script.set_image_import_settings(path.Replace(Application.dataPath,"Assets")+"/"+filename+".png",false,area1.textureFormat,TextureWrapMode.Clamp,area1.resolution,area1.mipmapEnabled,area1.filterMode,area1.anisoLevel,127);						
			if (global_script.map.preimage_edit.import_settings) {
				import_image_area = area1;
				import_png_path = path2.Replace(Application.dataPath,"Assets")+"/"+filename2+".png";
				import_settings_call = true;
				import_png_call = true;
			}
		}
	}
	
	function check_content_done()
	{
		if (!global_script) {return;}
		if (global_script.settings.wc_loading > 0)
        {
        	if (!global_script.settings.wc_contents) {global_script.settings.wc_loading = 0;return;}
        	var update_select: int = read_check();
        	if (global_script.settings.wc_loading == 1)
        	{
	        	if (global_script.settings.wc_contents.isDone)
	        	{
	        		global_script.settings.wc_loading = 0;
	        		var new_version: float;
	        		var old_version: float;
	        		
	        		old_version = read_version();
	        		write_checked(System.DateTime.Now.Day.ToString());
	        		var text: String = global_script.settings.wc_contents.text;
	        		// Debug.Log(text);
	        		if (Single.TryParse(global_script.settings.wc_contents.text,new_version))
	        		{
		        		global_script.settings.new_version = new_version;
		        		global_script.settings.old_version = old_version;
		        		if (new_version > old_version)
		        		{
		        			global_script.map.button_update = true;
		        			this.ShowNotification (GUIContent("A new WorldComposer update is available"));
		        			if (update_select == 0)
		        			{
		        				global_script.settings.update_version = true;
		        			}
		        			else if (update_select == 1)
		        			{
		        				global_script.settings.update_display = true;
		        				global_script.settings.update_version = true;
		        			}
		        			else if (update_select > 1)
		        			{
		        				global_script.settings.update_version = true;
		        				content_version();		
		        			}
		        		}
		        		else
		        		{
		        			global_script.settings.update_version = false;
		        		}
		        	}
		        }
	        }
        	else if (global_script.settings.wc_loading == 2)
        	{
	        	if (global_script.settings.wc_contents.isDone)
	        	{
	        		global_script.settings.wc_loading = 0;
	        		global_script.settings.update_version2 = true;
	        		global_script.settings.update_version = false;
	        		File.WriteAllBytes(Application.dataPath+"/TerrainComposer/Update/WorldComposer/WorldComposer.unitypackage",global_script.settings.wc_contents.bytes);
	        		if (update_select < 3)
	        		{
	        			global_script.settings.update_display = true;
	        		}
	        		else if (update_select == 3)
	        		{
	        			global_script.settings.update_display = true;
	        			import_contents(Application.dataPath+"/TerrainComposer/Update/WorldComposer/WorldComposer.unitypackage",false);
	        		}
	        		else if (update_select == 4)
	        		{
	        			import_contents(Application.dataPath+"/TerrainComposer/Update/WorldComposer/WorldComposer.unitypackage",false);
	        		}
	        	}
	        }
	        else if (global_script.settings.wc_loading == 3)
	        {
	        	if (global_script.settings.new_version == read_version())
	        	{
	        		AssetDatabase.Refresh();
	        		global_script.settings.wc_loading = 4;
	        	}
	        	else if (EditorApplication.timeSinceStartup > global_script.settings.time_out + 60){global_script.settings.wc_loading = 0;Debug.Log("Time out with importing WorldComposer update...");}
	        }
	        else if (global_script.settings.wc_loading == 4)
	        {
	        	Debug.Log("Updated WorldComposer version "+global_script.settings.old_version+" to version "+read_version().ToString("F3"));
	        	this.ShowNotification(GUIContent("Updated WorldComposer version "+global_script.settings.old_version+" to version "+read_version().ToString("F3")));
	        	global_script.settings.wc_loading = 0;
	        }
	    }
	}
	
	function read_version(): float
	{
		var sr: StreamReader = new File.OpenText(Application.dataPath+"/TerrainComposer/Update/WorldComposer/version.txt");
		var text: String = sr.ReadLine();
		sr.Close();
		
		var version: float;
		Single.TryParse(text,version);
		
		return version;
	}
	
	function write_check(text: String)
	{
		var sw: StreamWriter = new StreamWriter(Application.dataPath+"/TerrainComposer/Update/WorldComposer/check.txt");
		sw.WriteLine(text);
		sw.Close();
	}
	
	function read_check(): int
	{
		if (!File.Exists(Application.dataPath+"/TerrainComposer/Update/WorldComposer/check.txt")){write_check("1");}
		
		var sr: StreamReader = new File.OpenText(Application.dataPath+"/TerrainComposer/Update/WorldComposer/check.txt");
		var text: String = sr.ReadLine();
		sr.Close();
		
		var version: int;
		Int32.TryParse(text,version);
		
		return version;
	}
	
	function write_checked(text: String)
	{
		var sw: StreamWriter = new StreamWriter(Application.dataPath+"/TerrainComposer/Update/WorldComposer/last_checked.txt");
		sw.WriteLine(text);
		sw.Close();
	}
	
	function read_checked(): float
	{
		if (!File.Exists(Application.dataPath+"/TerrainComposer/Update/WorldComposer/last_checked.txt")){write_checked("-1");}
		
		var sr: StreamReader = new File.OpenText(Application.dataPath+"/TerrainComposer/Update/WorldComposer/last_checked.txt");
		
		var text: String = sr.ReadLine();
		sr.Close();
		
		var version: float;
		Single.TryParse(text,version);
		
		return version;
	}
	
	function content_startup()
    {
    	if (read_checked() != System.DateTime.Now.Day)
    	{
	    	if (read_check() > 0)
		    {
		    	check_content_version();
		    }
		}
    }
    
    function content_version()
    {
		var enc: Encoding = Encoding.Unicode;

		global_script.settings.wc_contents = new WWW(enc.GetString(process_out(File.ReadAllBytes(Application.dataPath+"/TerrainComposer/templates/content4.dat"))));
    	global_script.settings.wc_loading = 2;
	}
    
    function check_content_version() 
	{
		var enc: Encoding = Encoding.Unicode;
		
		if (global_script) {
			global_script.settings.wc_contents = new WWW(enc.GetString(process_out(File.ReadAllBytes(Application.dataPath+"/TerrainComposer/templates/content3.dat"))));  
    		global_script.settings.wc_loading = 1;
    	}
	}
	
	function import_contents(path: String,window: boolean)
	{
		var file_info: FileInfo = new FileInfo(Application.dataPath+"/tc_build/build.txt");
		if (file_info.Exists){Debug.Log("Updating canceled because of development version");} 
		else 
		{
			AssetDatabase.Refresh();
			AssetDatabase.ImportPackage(path,window);
			this.Repaint(); 
			// create_info_window();
		}
	
		global_script.settings.update_version2 = false;
		global_script.settings.time_out = EditorApplication.timeSinceStartup;
		global_script.settings.wc_loading = 3;
	}
	
	function asc_convert_to_raw(import_path: String,export_path: String)
	{
		// var ttt1: float = Time.realtimeSinceStartup;
		if (current_area.converter_height == 0) {current_area.converter_height = 9000;}
		
		var text: String;
		var file: StreamReader;
		var export_file: FileStream;
		var no_data: int;
		var height: float;
		var s: char;
		var byte_hi: byte;
		var byte_lo: byte;
		var value_int: int;
		var resolution: Vector2;
		
		file = new StreamReader(import_path);
		export_file = new FileStream(export_path,FileMode.Create);
		
		text = file.ReadLine();
		text = text.Replace("ncols",String.Empty);
		resolution.x = Int16.Parse(text);
		// Debug.Log(resolution.x);
		
		text = file.ReadLine();
		text = text.Replace("nrows",String.Empty);
		resolution.y = Int16.Parse(text);
		
		// Debug.Log(resolution.y);
		Debug.Log("Heightmap resolution X:"+resolution.x+" Y:"+resolution.y);
		
		current_area.converter_resolution = resolution;
		
		text = file.ReadLine();
		// Debug.Log(text);
		text = file.ReadLine();
		// Debug.Log(text);
		text = file.ReadLine();
		// Debug.Log(text);
		
		text = file.ReadLine();
		text = text.Replace("nodata_value",String.Empty);
		text = text.Replace("NODATA_value",String.Empty);
		no_data = Int16.Parse(text);
		// Debug.Log(text);
		
		text = String.empty;
		
		do 
		// for (var x: int = 0;x < 4000;++x)
		{
			s = file.Read();
			if (s == 32) {
				// Debug.Log(text);
				// text = text.Replace(" ",String.Empty);
				//if (text.Length > 0) {
					Single.TryParse(text,height);
					//{
						if (height == no_data) {height = 65535;}
						else {
							height = height*(65535.0/current_area.converter_height);
						}
					 	value_int = height;
						
						byte_hi = value_int >> 8; 
						byte_lo = value_int-(byte_hi << 8);
							
						export_file.WriteByte (byte_lo);
						export_file.WriteByte (byte_hi);
					//}
				//}
				text = String.Empty;
			}
			text += s; 
		}	
		while (!file.EndOfStream);
																		
		file.Close();
		export_file.Close();
		
		Debug.Log("Converted "+import_path+" -> "+export_path);
		this.ShowNotification(GUIContent("Converted "+import_path+" -> "+export_path));
	}
	
	function check_in_rect(): boolean
	{
		var in_rect: boolean = false;
		
		if (map_parameters_rect.Contains(key.mousePosition) && global_script.map.button_parameters) {return true;}
		if (regions_rect.Contains(key.mousePosition) && global_script.map.button_region) {return true;}
		if (areas_rect.Contains(key.mousePosition) && global_script.map.button_region) {return true;}
		if (heightmap_export_rect.Contains(key.mousePosition) && global_script.map.button_heightmap_export) {return true;}
		if (image_export_rect.Contains(key.mousePosition) && global_script.map.button_image_export) {return true;}
		if (image_editor_rect.Contains(key.mousePosition) && global_script.map.button_image_editor) {return true;}
		if (converter_rect.Contains(key.mousePosition) && global_script.map.button_converter) {return true;}
		if (settings_rect.Contains(key.mousePosition) && global_script.map.button_settings) {return true;}
		if (create_terrain_rect.Contains(key.mousePosition) && global_script.map.button_create_terrain) {return true;}
		// if (help_rect.Contains(key.mousePosition) && global_script.map.button_help) {return true;}
		if (update_rect.Contains(key.mousePosition) && global_script.map.button_update) {return true;}
	}
	
	function create_info_window()
	{
		if (info_window){info_window.Close();return;}
		info_window = EditorWindow.GetWindow(Info_tc);
		info_window.global_script = global_script;
		
		info_window.backgroundColor = Color(0,0,0,0.5);
		
		info_window.text = String.Empty;
		var sr: StreamReader = new File.OpenText(Application.dataPath+"/TerrainComposer/WorldComposer Release Notes.txt");
		
		info_window.update_height = 0;
		sr.ReadLine();
		sr.ReadLine();
		sr.ReadLine();
		
		do {
			info_window.text += sr.ReadLine()+"\n";
			info_window.update_height += 13;
		}
		while (!sr.EndOfStream);
		sr.Close();
		
		info_window.update_height += 13;
		info_window.minSize = Vector2(1024,512);
		info_window.title = "Release Notes";
		info_window.parent = this;
	}
	
	function smooth_terrain(preterrain1: terrain_class2,strength: float)
	{
		if (!preterrain1.terrain){return;}
		
		var heightmap_resolution: int = preterrain1.terrain.terrainData.heightmapResolution;
		var point: float;
		var delta_point: float;
		var point1: float;
		var point3: float;
		var new_height: float;
		
		var height: float = 1;
		var angle: float = 1;
		
		heights = preterrain1.terrain.terrainData.GetHeights(0,0,heightmap_resolution,heightmap_resolution);
		
		for (var count_strength: int = 0;count_strength < 1;++count_strength)
		{
			for (var y: int = 0;y < heightmap_resolution;++y)
			{
				for (var x: int = 1;x < heightmap_resolution-1;++x)
				{
					point1 = heights[x-1,y];
					point = heights[x,y];
					point3 = heights[x+1,y];
					
					delta_point = point-((point1+point3)/2);
					/*
					if (smooth_tool_advanced)
					{
						height = smooth_tool_height_curve.curve.Evaluate(point);
						angle = smooth_tool_angle_curve.curve.Evaluate(calc_terrain_angle(preterrain1,x,y,settings.smooth_angle)/90);
					}
					*/
					delta_point *= (1-(strength*height*angle));
					new_height = delta_point+((point1+point3)/2);
					heights[x,y] = new_height;
				}
			}
		
			for (y = 1;y < heightmap_resolution-1;++y)
			{
				for (x = 0;x < heightmap_resolution;++x)
				{
					point1 = heights[x,y-1];
					point = heights[x,y];
					point3 = heights[x,y+1];
					
					delta_point = point-((point1+point3)/2);
					/*
					if (smooth_tool_advanced)
					{
						height = smooth_tool_height_curve.curve.Evaluate(point);
						angle = smooth_tool_angle_curve.curve.Evaluate(calc_terrain_angle(preterrain1,x,y,settings.smooth_angle)/90);
					}
					*/
					delta_point *= (1-(strength*height*angle));
					new_height = delta_point+((point1+point3)/2);
					heights[x,y] = new_height;
				}
			}
		}
		
		preterrain1.terrain.terrainData.SetHeights(0,0,heights);
		if (preterrain1.color_terrain[0] < 1.5){preterrain1.color_terrain += Color(0.5,0.5,1,0.5);}
	}
	
	function smooth_all_terrain(strength: float)
	{
		for (var count_terrain: int = 0;count_terrain < terrain_region.area[0].terrains.Count;++count_terrain)
		{
			smooth_terrain(terrain_region.area[0].terrains[count_terrain],strength);
		}
		
		heights = new float [0,0];
	}
	
	function save_global_settings()
	{
		if (global_script) {
			EditorUtility.SetDirty (global_script);
			EditorApplication.SaveAssets();
			// AssetDatabase.SaveAssets();
			// AssetDatabase.ImportAsset("Assets/TerrainComposer/Templates/global_settings.prefab");
			// AssetDatabase.Refresh();
			
		}
	}
	
	function create_rtp_combined_textures(preterrain1: terrain_class2)
	{
		preterrain1.rtp_script.globalSettingsHolder.RefreshAll();
		var height_created: boolean = true;
		
		if (!preterrain1.rtp_script.globalSettingsHolder.PrepareNormals()) {
			this.ShowNotification(GUIContent("RTP needs the Normal Textures to be readable and they have to be the same size, pleace adjust this in the image import settings"));
			return;
		}
		preterrain1.rtp_script.globalSettingsHolder.HeightMap = rtp_functions.PrepareHeights(0,preterrain1.rtp_script.globalSettingsHolder.numLayers,preterrain1.rtp_script.globalSettingsHolder.Heights);
		if (!preterrain1.rtp_script.globalSettingsHolder.HeightMap) {height_created = false;} 
		
		else if (preterrain1.rtp_script.globalSettingsHolder.numLayers > 4) {
			preterrain1.rtp_script.globalSettingsHolder.HeightMap2 = rtp_functions.PrepareHeights(4,preterrain1.rtp_script.globalSettingsHolder.numLayers,preterrain1.rtp_script.globalSettingsHolder.Heights);
			if (!preterrain1.rtp_script.globalSettingsHolder.HeightMap2) {height_created = false;}
		}
		else if (preterrain1.rtp_script.globalSettingsHolder.numLayers > 8) {
			preterrain1.rtp_script.globalSettingsHolder.HeightMap3 = rtp_functions.PrepareHeights(8,preterrain1.rtp_script.globalSettingsHolder.numLayers,preterrain1.rtp_script.globalSettingsHolder.Heights);
			if (!preterrain1.rtp_script.globalSettingsHolder.HeightMap3 || !height_created) {height_created = false;}
		}
		if (!height_created) {
			this.ShowNotification(GUIContent("RTP needs the Height Textures to be readable and they have to be the same size, pleace adjust this in the image import settings"));
			return;
		}
		// preterrain1.rtp_script.globalSettingsHolder.HeightMap = new Texture2D(512,512);
	}	  
	
	function load_button_textures()
	{
		var install_path: String = "Assets/TerrainComposer";
		
		button_settings = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_settings.png",Texture);
		button_help = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_help.png",Texture); 
		button_heightmap = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_heightmap.png",Texture);
		button_update = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_update.png",Texture);
		button_terrain = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_terrain.png",Texture);
		button_map = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_map.png",Texture);
		button_region = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_region.png",Texture);
		button_edit = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_edit.png",Texture);
		button_image = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_splatmap.png",Texture);
		button_converter = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_convert.png",Texture);
	}
	
	function reset_exports()
	{
		stop_all_elevation_pull();
		stop_all_image_pull();
	}
	
	function check_area_resize(): boolean
	{
		if (!area_rounded) {
			if (notify_text.Length != 0) {notify_text += "\n\n";}
			notify_text += "The tiles are not fitting in the Area. Please resize the area";
			global_script.map.mode = 2;
			return true;
		}
		return false;
	}
}
 
