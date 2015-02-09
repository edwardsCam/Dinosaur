#pragma strict

var scale: Vector3;
var health: float;
var mass: float;
var terrain: Terrain;
var terrain_size: Vector3;
var terrain_position: Vector3;
var rotation1: Vector3;
var rotation: Quaternion;
var speed_world: Vector3;
var speed_local: Vector3;
var air_density: float = 1;
var deltaTime: float = 0.01;
var air_resistance_front: float;
var air_resistance_back: float;
var air_resistance_side: float;
var air_resistance_top: float;
var height: float;
var preterrain: terrain_class;
var heightmap_y: int;
var heightmap_x: int;
var myTransform: Transform;
var out_of_range: boolean = false;
var count_wide: int;
var count_length :int;
var position: Vector3;
var height_old: float;
var height_set: boolean = false;

var position_start: Vector3;
var scale_start: Vector3;
var multiplier: float = 1;
var type: int = 0;

var point1: float;
var point2: Vector3;
var point3: float;
var heading_old: float;
var speed_x: boolean = false;
var loop_time: float = 0;
var x_def: float;
var shave: float;
var release: float;
var eroded: float;
var erose: float;

function Start()
{
	scale = transform.localScale;
	scale_start = scale;
	terrain_size = terrain.terrainData.size;
	terrain_position = terrain.transform.position;
	myTransform = transform;
	
	position_start = myTransform.position;
	type = Random.Range(0,10);
	
	air_resistance_front = 0;
	air_resistance_back = 0.2;
	air_resistance_side = 5;
	air_resistance_top = 0.001;
	
	health = Random.Range(10,200);
	mass = health;
	speed_local.z = Random.Range(0,1);
	speed_world = myTransform.TransformDirection(speed_local);
	deltaTime = 0.01;
	x_def = Random.Range(-10,10);
	
}

function erosion()
{
	if (type < 5){erosion1();} 
	else if (type < 10){erosion1();}
	//else {erosion5();}
	

}

function random_position(pos1: Vector3): Vector3
{
	pos1.x = Random.Range(pos1.x-50,pos1.x+50);
	pos1.y = Random.Range(pos1.y-50,pos1.y+50);
	pos1.z = Random.Range(pos1.z-50,pos1.z+50);
	x_def = Random.Range(-7,7);
	eroded = 0;
	loop_time = 0;
	return pos1;
	
}


function erosion1()
{
	//Debug.Log("alive!");
	
	if (!out_of_range)
	{
		rotation1 = terrain.terrainData.GetInterpolatedNormal((myTransform.position.x-terrain_position.x)/terrain_size.x,(myTransform.position.z-terrain_position.z)/terrain_size.z);
		//if (rotation.x == 0 && rotation.z == 0){rotation.x = 0.01;Debug.Log("0");}
		rotation1.x = (rotation1.x/3)*2;
		rotation1.z = (rotation1.z/3)*2;
		
		
		
		rotation = Quaternion.LookRotation(rotation1);
		rotation.eulerAngles.x += 90;
		//rotation = Quaternion.RotateTowards(myTransform.rotation,rotation,15);
		//if(rotation.eulerAngles.x < 0){rotation.eulerAngles.y += 180;}
		rotation1 = rotation.eulerAngles;
		
		
		
		if (Mathf.Abs(Mathf.DeltaAngle(rotation1.y,heading_old)) > 90 && height_set){health = -1;}
		shave = rotation1.x;
		if (shave < 45){release = 45-shave;} else {release = 0;}
		if (shave > 45){shave = 90-shave;}
		myTransform.localEulerAngles = rotation1;
		heading_old = rotation1.y;
	}
	
	
	
	//speed_local = myTransform.InverseTransformDirection(speed_world);
	
	
		//speed_local.z += (rotation1.x+30)*deltaTime*.03*scale_start.z;
		
		multiplier = 1;//*((height/0));
	
	if (!speed_x){speed_local.z = preterrain.heightmap_conversion.x;} else {speed_local.x = -preterrain.heightmap_conversion.x;}
	//speed_local.z = preterrain.heightmap_conversion.x;
	scale.x = (1500/(height+40))+scale_start.x;
	
	
	//scale.z = speed_local.z/2;
	
	//myTransform.localScale.x = scale.x;
	//myTransform.localScale.z = scale.z;
	
	//air_resistance_side = height/50;
	
	//if (speed_local.z > 0){speed_local.z -= deltaTime*air_resistance_front*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z < 0){speed_local.z = 0;}}
	//if (speed_local.z < 0){speed_local.z += deltaTime*air_resistance_back*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z > 0){speed_local.z = 0;}}
	//if (speed_local.x > 0){speed_local.x -= deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x < 0){speed_local.x = 0;}}
	//if (speed_local.x < 0){speed_local.x += deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x > 0){speed_local.x = 0;}}
	//if (speed_local.y > 0){speed_local.y -= deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y < 0){speed_local.y = 0;}}
	//if (speed_local.y < 0){speed_local.y += deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y > 0){speed_local.y = 0;}}
							
	//health -= 1;
	if (health < 0 || out_of_range || speed_local.z < 0){health = Random.Range(10,200);myTransform.position = random_position(position_start);height_set = false;speed_local = Vector3(0,0,0);out_of_range = false;return;}
							
							//for (var count_length: int = 0;count_length < scale.x;count_length += preterrain.heightmap_conversion.y)
							//{
								position = myTransform.position;
								speed_local.x = (release/45)*(x_def);
								
								loop_time += release/45;
								
								//for (var count_wide: int = 0;count_wide < scale.x;count_wide += preterrain.heightmap_conversion.x)
								//{
									
									//position += position.forward*count_length;
									
									heightmap_x = Mathf.Round((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
									heightmap_y = Mathf.Round((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
									out_of_range = false;
									
									if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x < 0){out_of_range = true;}
									if (heightmap_y < 0){out_of_range = true;}
									//if (myTransform.position.y > height+1){out_of_range = true;}
									
									if (!out_of_range)
									{
										//if ((mass*(speed_local.z))/800000 > 0){
										if (height_set)
										{
											erose = ((scale.y*(shave/5))/10)*multiplier;
											
											if (eroded > ((scale.y*((release)/25))/10)*multiplier){erose -= ((scale.y*((release)/25))/10)*multiplier;}
											
											// preterrain.heights[heightmap_y,heightmap_x] -= erose;
											eroded += erose;
											
											
											//height_old = preterrain.heights[heightmap_y,heightmap_x];
											
										}
										
										height_set = true;
										
										if (heightmap_y > preterrain.heightmap_resolution-2){heightmap_y = preterrain.heightmap_resolution-2;}
										if (heightmap_x > preterrain.heightmap_resolution-2){heightmap_x = preterrain.heightmap_resolution-2;}
										if (heightmap_x < 0){heightmap_x = 0;}
										if (heightmap_y < 0){heightmap_y = 0;}
										
										if (preterrain.map[heightmap_y,heightmap_x,2] < 1)
										{
											preterrain.map[heightmap_y,heightmap_x,2] += (scale.y*(speed_local.z)*(height/500))/800;
																						
											preterrain.map[heightmap_y,heightmap_x,0] = preterrain.map[heightmap_y,heightmap_x,0] - ((scale.y*(speed_local.z)*(height/500))/800)/4;
											preterrain.map[heightmap_y,heightmap_x,1] = preterrain.map[heightmap_y,heightmap_x,1] - ((scale.y*(speed_local.z)*(height/500))/800)/4;
											preterrain.map[heightmap_y,heightmap_x,3] = preterrain.map[heightmap_y,heightmap_x,3] - ((scale.y*(speed_local.z)*(height/500))/800)/4;
											preterrain.map[heightmap_y,heightmap_x,4] = preterrain.map[heightmap_y,heightmap_x,4] - ((scale.y*(speed_local.z)*(height/500))/800)/4;
										}
										
									}
									
								//}
								//height_old = preterrain.heights[heightmap_y,heightmap_x];
							//}
	
	//speed_world = myTransform.TransformDirection(speed_local);
	
	//speed_world.y -= 9.81*deltaTime;
	
	
	myTransform.Translate(speed_local.x,speed_local.y,speed_local.z);
	height = terrain.SampleHeight(myTransform.position);
	myTransform.position.y = height;
	
	//if (out_of_range){DestroyImmediate(gameObject);}
}


// x-axis
function erosion2()
{
	//Debug.Log("alive!");
	
	if (!out_of_range)
	{
		rotation1 = terrain.terrainData.GetInterpolatedNormal((myTransform.position.x-terrain_position.x)/terrain_size.x,(myTransform.position.z-terrain_position.z)/terrain_size.z);
		height = terrain.SampleHeight(myTransform.position);
		rotation1.x = (rotation1.x/3)*2;
		rotation1.z = (rotation1.z/3)*2;
		
		rotation = Quaternion.LookRotation(rotation1);
		rotation.eulerAngles.x += 90;
		rotation.eulerAngles.y += 90;
		rotation = Quaternion.RotateTowards(myTransform.rotation,rotation,3);
		//if(rotation.eulerAngles.x < 0){rotation.eulerAngles.y += 180;}
		rotation1 = rotation.eulerAngles;
		
	}
	
	
	
	speed_local = myTransform.InverseTransformDirection(speed_world);
	
	if (speed_local.z < 0){multiplier = speed_local.z*-1;}
	else
	{
		speed_local.z += (rotation1.x+30)*deltaTime*.03*scale_start.z;
		multiplier = 1;//*((height/0));
	}
	
	scale.x = (1500/(height+40))+scale_start.x;
	
	
	scale.z = speed_local.z/2;
	
	myTransform.localScale.x = scale.x;
	myTransform.localScale.z = scale.z;
	
	//air_resistance_side = height/50;
	
	if (speed_local.z > 0){speed_local.z -= deltaTime*air_resistance_front*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z < 0){speed_local.z = 0;}}
	if (speed_local.z < 0){speed_local.z += deltaTime*air_resistance_back*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z > 0){speed_local.z = 0;}}
	if (speed_local.x > 0){speed_local.x -= deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x < 0){speed_local.x = 0;}}
	if (speed_local.x < 0){speed_local.x += deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x > 0){speed_local.x = 0;}}
	if (speed_local.y > 0){speed_local.y -= deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y < 0){speed_local.y = 0;}}
	if (speed_local.y < 0){speed_local.y += deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y > 0){speed_local.y = 0;}}
							
	health -= 1;
	if (health < 0 || out_of_range || speed_local.z < 0){health = Random.Range(15,555);myTransform.position = position_start;height_set = false;speed_local.z = 0;}
							
							//for (var count_length: int = 0;count_length < scale.x;count_length += preterrain.heightmap_conversion.y)
							//{
								position = myTransform.position;
								
								
								//for (var count_wide: int = 0;count_wide < scale.x;count_wide += preterrain.heightmap_conversion.x)
								//{
									
									//position += position.forward*count_length;
									
									heightmap_x = Mathf.Round((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
									heightmap_y = Mathf.Round((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
									out_of_range = false;
									
									if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x < 0){out_of_range = true;}
									if (heightmap_y < 0){out_of_range = true;}
									//if (myTransform.position.y > height+1){out_of_range = true;}
									
									if (!out_of_range)
									{
										//if ((mass*(speed_local.z))/800000 > 0){
										if (height_set)
										{
											// preterrain.heights[heightmap_y,heightmap_x] -= ((scale.y*(speed_local.z/5))/5500)*multiplier;
											//height_old = preterrain.heights[heightmap_y,heightmap_x];
											
										}
										
										height_set = true;
										
										if (heightmap_y > preterrain.heightmap_resolution-2){heightmap_y = preterrain.heightmap_resolution-2;}
										if (heightmap_x > preterrain.heightmap_resolution-2){heightmap_x = preterrain.heightmap_resolution-2;}
										if (heightmap_x < 0){heightmap_x = 0;}
										if (heightmap_y < 0){heightmap_y = 0;}
										
										if (preterrain.map[heightmap_y,heightmap_x,2] < 1)
										{
											//preterrain.map[heightmap_y,heightmap_x,2] += (scale.y*(speed_local.z)*(height/500))/580;
																						
											//preterrain.map[heightmap_y,heightmap_x,0] = preterrain.map[heightmap_y,heightmap_x,0] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
											//preterrain.map[heightmap_y,heightmap_x,1] = preterrain.map[heightmap_y,heightmap_x,1] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
											//preterrain.map[heightmap_y,heightmap_x,3] = preterrain.map[heightmap_y,heightmap_x,3] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
											//preterrain.map[heightmap_y,heightmap_x,4] = preterrain.map[heightmap_y,heightmap_x,4] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
										}
										
									}
									
								//}
								//height_old = preterrain.heights[heightmap_y,heightmap_x];
							//}
	
	speed_world = myTransform.TransformDirection(speed_local);
	
	//speed_world.y -= 9.81*deltaTime;
	myTransform.rotation = rotation;
	
	myTransform.Translate(speed_world.x,speed_world.y,speed_world.z,Space.World);
	height = terrain.SampleHeight(myTransform.position);
	if (myTransform.position.y < height){myTransform.position.y = height;}
	
	//if (out_of_range){DestroyImmediate(gameObject);}
}

// invert z -axis
function erosion5()
{
	//Debug.Log("alive!");
	
	if (!out_of_range)
	{
		rotation1 = terrain.terrainData.GetInterpolatedNormal((myTransform.position.x-terrain_position.x)/terrain_size.x,(myTransform.position.z-terrain_position.z)/terrain_size.z);
		height = terrain.SampleHeight(myTransform.position);
		rotation1.x = (rotation1.x/3)*2;
		rotation1.z = (rotation1.z/3)*2;
		
		rotation = Quaternion.LookRotation(rotation1);
		rotation.eulerAngles.x += 90;
		rotation.eulerAngles.y += 180;
		//rotation = Quaternion.RotateTowards(myTransform.rotation,rotation,15);
		//if(rotation.eulerAngles.x < 0){rotation.eulerAngles.y += 180;}
		rotation1 = rotation.eulerAngles;
		
	}
	
	
	
	speed_local = myTransform.InverseTransformDirection(speed_world);
	
	
		//speed_local.z += (rotation1.x+30)*deltaTime*.03*scale_start.z;
		speed_local.z = preterrain.heightmap_conversion.x;
		multiplier = 1;//*((height/0));
	
	scale.x = (1500/(height+40))+scale_start.x;
	
	
	//scale.z = speed_local.z/2;
	
	//myTransform.localScale.x = scale.x;
	//myTransform.localScale.z = scale.z;
	
	//air_resistance_side = height/50;
	
	if (speed_local.z > 0){speed_local.z -= deltaTime*air_resistance_front*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z < 0){speed_local.z = 0;}}
	if (speed_local.z < 0){speed_local.z += deltaTime*air_resistance_back*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z > 0){speed_local.z = 0;}}
	if (speed_local.x > 0){speed_local.x -= deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x < 0){speed_local.x = 0;}}
	if (speed_local.x < 0){speed_local.x += deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x > 0){speed_local.x = 0;}}
	if (speed_local.y > 0){speed_local.y -= deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y < 0){speed_local.y = 0;}}
	if (speed_local.y < 0){speed_local.y += deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y > 0){speed_local.y = 0;}}
							
	health -= 1;
	if (health < 0 || out_of_range || speed_local.z < 0){health = Random.Range(15,555);myTransform.position = position_start;height_set = false;}
							
							//for (var count_length: int = 0;count_length < scale.x;count_length += preterrain.heightmap_conversion.y)
							//{
								position = myTransform.position;
								
								
								//for (var count_wide: int = 0;count_wide < scale.x;count_wide += preterrain.heightmap_conversion.x)
								//{
									
									//position += position.forward*count_length;
									
									heightmap_x = Mathf.Round((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
									heightmap_y = Mathf.Round((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
									out_of_range = false;
									
									if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x < 0){out_of_range = true;}
									if (heightmap_y < 0){out_of_range = true;}
									//if (myTransform.position.y > height+1){out_of_range = true;}
									
									if (!out_of_range)
									{
										//if ((mass*(speed_local.z))/800000 > 0){
										if (height_set)
										{
											// preterrain.heights[heightmap_y,heightmap_x] += ((scale.y*(speed_local.z/5))/5500)*multiplier;
											//height_old = preterrain.heights[heightmap_y,heightmap_x];
											
										}
										
										height_set = true;
										
										if (heightmap_y > preterrain.heightmap_resolution-2){heightmap_y = preterrain.heightmap_resolution-2;}
										if (heightmap_x > preterrain.heightmap_resolution-2){heightmap_x = preterrain.heightmap_resolution-2;}
										if (heightmap_x < 0){heightmap_x = 0;}
										if (heightmap_y < 0){heightmap_y = 0;}
										
										if (preterrain.map[heightmap_y,heightmap_x,2] < 1)
										{
											//preterrain.map[heightmap_y,heightmap_x,2] += (scale.y*(speed_local.z)*(height/500))/580;
																						
											//preterrain.map[heightmap_y,heightmap_x,0] = preterrain.map[heightmap_y,heightmap_x,0] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
											//preterrain.map[heightmap_y,heightmap_x,1] = preterrain.map[heightmap_y,heightmap_x,1] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
											//preterrain.map[heightmap_y,heightmap_x,3] = preterrain.map[heightmap_y,heightmap_x,3] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
											//preterrain.map[heightmap_y,heightmap_x,4] = preterrain.map[heightmap_y,heightmap_x,4] - ((scale.y*(speed_local.z)*(height/500))/580)/4;
										}
										
									}
									
								//}
								//height_old = preterrain.heights[heightmap_y,heightmap_x];
							//}
	
	speed_world = myTransform.TransformDirection(speed_local);
	
	//speed_world.y -= 9.81*deltaTime;
	myTransform.rotation = rotation;
	
	myTransform.Translate(speed_world.x,speed_world.y,speed_world.z,Space.World);
	if (myTransform.position.y < height){myTransform.position.y = height;}
	
	//if (out_of_range){DestroyImmediate(gameObject);}
}


// smooth
function erosion3()
{
	//Debug.Log("alive!");
	
	if (!out_of_range)
	{
		rotation1 = terrain.terrainData.GetInterpolatedNormal((myTransform.position.x-terrain_position.x)/terrain_size.x,(myTransform.position.z-terrain_position.z)/terrain_size.z);
		rotation1.x = (rotation1.x/3)*2;
		rotation1.z = (rotation1.z/3)*2;
		
		rotation = Quaternion.LookRotation(rotation1);
		rotation.eulerAngles.x += 90;
		rotation = Quaternion.RotateTowards(myTransform.rotation,rotation,3);
		//if(rotation.eulerAngles.x < 0){rotation.eulerAngles.y += 180;}
		rotation1 = rotation.eulerAngles;
		
	}
	
	
	
	speed_local = myTransform.InverseTransformDirection(speed_world);
	
	
		speed_local.z += (rotation1.x+30)*deltaTime*.03*scale_start.z;
		multiplier = 1;//*((height/0));
	

	
	scale.x = (1500/(height+40))+scale_start.x;
	
	
	//scale.z = speed_local.z/2;
	
	//myTransform.localScale.x = scale.x;
	//myTransform.localScale.z = scale.z;
	
	//air_resistance_side = height/50;
	
	if (speed_local.z > 0){speed_local.z -= deltaTime*air_resistance_front*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z < 0){speed_local.z = 0;}}
	if (speed_local.z < 0){speed_local.z += deltaTime*air_resistance_back*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z > 0){speed_local.z = 0;}}
	if (speed_local.x > 0){speed_local.x -= deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x < 0){speed_local.x = 0;}}
	if (speed_local.x < 0){speed_local.x += deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x > 0){speed_local.x = 0;}}
	if (speed_local.y > 0){speed_local.y -= deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y < 0){speed_local.y = 0;}}
	if (speed_local.y < 0){speed_local.y += deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y > 0){speed_local.y = 0;}}
							
	health -= 1;
	if (health < 0 || out_of_range || speed_local.z < 0){health = Random.Range(15,555);myTransform.position = position_start;height_set = false;speed_local.z = 0;}
							
							//for (var count_length: int = 0;count_length < scale.x;count_length += preterrain.heightmap_conversion.y)
							//{
								
								
								
								//for (var count_wide: int = 0;count_wide < scale.x;count_wide += preterrain.heightmap_conversion.x)
								//{
									
									//position += position.forward*count_length;
									position = myTransform.position-(myTransform.forward*preterrain.heightmap_conversion.x);
									
									heightmap_x = ((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
									heightmap_y = ((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
									out_of_range = false;
									
									if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x < 0){out_of_range = true;}
									if (heightmap_y < 0){out_of_range = true;}
									//if (myTransform.position.y > height+1){out_of_range = true;}
									
									if (!out_of_range)
									{
										//if ((mass*(speed_local.z))/800000 > 0){
										// point1 = preterrain.heights[heightmap_y,heightmap_x];
									
										position = myTransform.position+(myTransform.forward*preterrain.heightmap_conversion.x);
										
										heightmap_x = ((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
										heightmap_y = ((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
										out_of_range = false;
										
										if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
										if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
										if (heightmap_x < 0){out_of_range = true;}
										if (heightmap_y < 0){out_of_range = true;}
									
										if (!out_of_range)
										{
											// point3 = preterrain.heights[heightmap_y,heightmap_x];
										
											position = myTransform.position;
											
											heightmap_x = ((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
											heightmap_y = ((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
											out_of_range = false;
											
											if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
											if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
											if (heightmap_x < 0){out_of_range = true;}
											if (heightmap_y < 0){out_of_range = true;}
											
											// if (!out_of_range){preterrain.heights[heightmap_y,heightmap_x] = (point1+point3)/2;}
										}
									
									}
									
								//}
								//height_old = preterrain.heights[heightmap_y,heightmap_x];
							//}
	
	speed_world = myTransform.TransformDirection(speed_local);
	
	
	//speed_world.y -= 9.81*deltaTime;
	myTransform.rotation = rotation;
	
	myTransform.Translate(speed_world.x,speed_world.y,speed_world.z,Space.World);
	height = terrain.SampleHeight(myTransform.position);
		
	if (myTransform.position.y < height){myTransform.position.y = height;}
	//if (out_of_range){DestroyImmediate(gameObject);}
}


function erosion4()
{
	//Debug.Log("alive!");
	
	if (!out_of_range)
	{
		rotation1 = terrain.terrainData.GetInterpolatedNormal((myTransform.position.x-terrain_position.x)/terrain_size.x,(myTransform.position.z-terrain_position.z)/terrain_size.z);
		height = terrain.SampleHeight(myTransform.position);
		rotation1.x = (rotation1.x/3)*2;
		rotation1.z = (rotation1.z/3)*2;
		
		rotation = Quaternion.LookRotation(rotation1);
		rotation.eulerAngles.x += 90;
		rotation = Quaternion.RotateTowards(myTransform.rotation,rotation,15);
		//if(rotation.eulerAngles.x < 0){rotation.eulerAngles.y += 180;}
		rotation1 = rotation.eulerAngles;
		
	}
	
	
	
	speed_local = myTransform.InverseTransformDirection(speed_world);
	
	if (speed_local.z < 0){multiplier = speed_local.z*-1;}
	else
	{
		speed_local.z += (rotation1.x+30)*deltaTime*.03*scale_start.z;
		multiplier = 1;//*((height/0));
	}
	
	scale.x = (1500/(height+40))+scale_start.x;
	
	
	scale.z = speed_local.z/2;
	
	myTransform.localScale.x = scale.x;
	myTransform.localScale.z = scale.z;
	
	//air_resistance_side = height/50;
	
	if (speed_local.z > 0){speed_local.z -= deltaTime*air_resistance_front*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z < 0){speed_local.z = 0;}}
	if (speed_local.z < 0){speed_local.z += deltaTime*air_resistance_back*air_density*((speed_local.z)*(speed_local.z));if (speed_local.z > 0){speed_local.z = 0;}}
	if (speed_local.x > 0){speed_local.x -= deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x < 0){speed_local.x = 0;}}
	if (speed_local.x < 0){speed_local.x += deltaTime*air_resistance_side*air_density*((speed_local.x)*(speed_local.x));if (speed_local.x > 0){speed_local.x = 0;}}
	if (speed_local.y > 0){speed_local.y -= deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y < 0){speed_local.y = 0;}}
	if (speed_local.y < 0){speed_local.y += deltaTime*air_resistance_top*air_density*((speed_local.y)*(speed_local.y));if (speed_local.y > 0){speed_local.y = 0;}}
							
	health -= 1;
	if (health < 0 || out_of_range || speed_local.z < 0){health = Random.Range(15,555);myTransform.position = position_start;height_set = false;speed_local.z = 0;}
							
							//for (var count_length: int = 0;count_length < scale.x;count_length += preterrain.heightmap_conversion.y)
							//{
								
								
								
								//for (var count_wide: int = 0;count_wide < scale.x;count_wide += preterrain.heightmap_conversion.x)
								//{
									
									//position += position.forward*count_length;
									position = myTransform.position-(myTransform.forward*preterrain.heightmap_conversion.x);
									
									heightmap_x = Mathf.Round((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
									heightmap_y = Mathf.Round((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
									out_of_range = false;
									
									if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
									if (heightmap_x < 0){out_of_range = true;}
									if (heightmap_y < 0){out_of_range = true;}
									//if (myTransform.position.y > height+1){out_of_range = true;}
									
									if (!out_of_range)
									{
										//if ((mass*(speed_local.z))/800000 > 0){
										// point1 = preterrain.heights[heightmap_y,heightmap_x];
									
										position = myTransform.position+(myTransform.forward*preterrain.heightmap_conversion.x);
										
										heightmap_x = Mathf.Round((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
										heightmap_y = Mathf.Round((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
										out_of_range = false;
										
										if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
										if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
										if (heightmap_x < 0){out_of_range = true;}
										if (heightmap_y < 0){out_of_range = true;}
									 
										if (!out_of_range)
										{
											// point3 = preterrain.heights[heightmap_y,heightmap_x];
										
											position = myTransform.position;
											
											heightmap_x = Mathf.Round((position.x-terrain_position.x)/preterrain.heightmap_conversion.x); 
											heightmap_y = Mathf.Round((position.z-terrain_position.z)/preterrain.heightmap_conversion.y);
											out_of_range = false;
											
											if (heightmap_y > preterrain.heightmap_resolution-1){out_of_range = true;}
											if (heightmap_x > preterrain.heightmap_resolution-1){out_of_range = true;}
											if (heightmap_x < 0){out_of_range = true;}
											if (heightmap_y < 0){out_of_range = true;}
											
											// if (!out_of_range){preterrain.heights[heightmap_y,heightmap_x] = (point1+point3)/2;}
										}
									
									}
									
								//}
								//height_old = preterrain.heights[heightmap_y,heightmap_x];
							//}
	
	speed_world = myTransform.TransformDirection(speed_local);
	
	//speed_world.y -= 9.81*deltaTime;
	myTransform.rotation = rotation;
	
	myTransform.Translate(speed_world.x,speed_world.y,speed_world.z,Space.World);
	if (myTransform.position.y < height){myTransform.position.y = height;}
	
	//if (out_of_range){DestroyImmediate(gameObject);}
}
